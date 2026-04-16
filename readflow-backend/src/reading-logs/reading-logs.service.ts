/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mood, ReadingLog } from './entities/reading-log.entity';
import { Book } from '../books/entities/book.entity';
import { CreateReadingLogDto } from './dto/create-reading-log.dto';
import { StreaksService } from '../streaks/streaks.service';

@Injectable()
export class ReadingLogsService {
  constructor(
    @InjectRepository(ReadingLog)
    private readonly logRepository: Repository<ReadingLog>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly streaksService: StreaksService,
  ) {}

  async create(userId: string, dto: CreateReadingLogDto): Promise<ReadingLog> {
    // Verify book belongs to user
    const book = await this.bookRepository.findOne({
      where: { id: dto.bookId, userId },
    });

    if (!book) {
      throw new NotFoundException('Book not found or you do not own this book');
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

    // Update book's current page
    const newCurrentPage = Math.min(
      book.currentPage + dto.pagesRead,
      book.totalPages || book.currentPage + dto.pagesRead,
    );

    await this.bookRepository.update(dto.bookId, {
      currentPage: newCurrentPage,
    });

    // Update streak
    await this.streaksService.checkAndUpdateStreak(userId, logDate);

    return saved;
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
