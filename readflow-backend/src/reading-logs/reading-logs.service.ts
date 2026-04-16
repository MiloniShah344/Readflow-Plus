/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mood, ReadingLog } from './entities/reading-log.entity';
import { Book, BookStatus } from '../books/entities/book.entity';
import { CreateReadingLogDto } from './dto/create-reading-log.dto';
import { StreaksService } from '../streaks/streaks.service';
import { GamificationService } from '../gamification/gamification.service';

const XP_PER_SESSION = 10;
@Injectable()
export class ReadingLogsService {
  constructor(
    @InjectRepository(ReadingLog)
    private readonly logRepository: Repository<ReadingLog>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly streaksService: StreaksService,
    private readonly gamificationService: GamificationService,
  ) {}

  async create(userId: string, dto: CreateReadingLogDto) {
    // Verify book belongs to user
    const book = await this.bookRepository.findOne({
      where: { id: dto.bookId, userId },
    });

    if (!book) {
      throw new NotFoundException('Book not found or you do not own this book');
    }

    const remainingPages =
      (book.totalPages || Infinity) - (book.currentPage || 0);

    if (dto.pagesRead > remainingPages) {
      throw new BadRequestException(
        `Cannot log more than ${remainingPages} pages`,
      );
    }

    // Create the reading log
    const today = new Date().toISOString().split('T')[0];
    const logDate = dto.date || today;

    const log = this.logRepository.create({
      ...dto,
      userId,
      date: logDate,
      mood: dto.mood || Mood.NEUTRAL,
      focusLevel: dto.focusLevel || 3,
    });

    const saved = await this.logRepository.save(log);

    const totalPages = book.totalPages || Infinity;
    const newCurrentPage = book.currentPage + dto.pagesRead;

    let newStatus = book.status;

    // Auto mark in progress
    if (book.status === BookStatus.TO_READ) {
      newStatus = BookStatus.IN_PROGRESS;
    }

    // Auto complete
    if (newCurrentPage >= totalPages) {
      newStatus = BookStatus.COMPLETED;
    }

    await this.bookRepository.update(dto.bookId, {
      currentPage: newCurrentPage,
      status: newStatus,
    });

    // Update streak
    await this.streaksService.checkAndUpdateStreak(userId, logDate);
    // Gamification — grant XP then check achievements
    const xpResult = await this.gamificationService.grantXP(
      userId,
      XP_PER_SESSION,
    );
    const newAchievements =
      await this.gamificationService.checkAchievements(userId);

    return {
      ...saved,
      xpGained: XP_PER_SESSION,
      newAchievements,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
      newLevelName: xpResult.newLevelName,
    };
  }

  async findAll(
    userId: string,
    bookId?: string,
    date?: string,
  ): Promise<ReadingLog[]> {
    const query = this.logRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.book', 'book')
      .where('log.userId = :userId', { userId })
      .orderBy('log.date', 'DESC')
      .addOrderBy('log.createdAt', 'DESC');

    if (bookId) {
      query.andWhere('log.bookId = :bookId', { bookId });
    }

    if (date) {
      query.andWhere('log.date = :date', { date });
    }

    return query.getMany();
  }

  async getTotalPages(userId: string): Promise<number> {
    const result = await this.logRepository
      .createQueryBuilder('log')
      .select('SUM(log.pagesRead)', 'total')
      .where('log.userId = :userId', { userId })
      .getRawOne();

    return parseInt(result.total) || 0;
  }
}
