/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { UserGoal } from './entities/user-goal.entity';
import { ReadingLog } from '../reading-logs/entities/reading-log.entity';
import { Book } from '../books/entities/book.entity';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(UserGoal)
    private readonly goalRepository: Repository<UserGoal>,
    @InjectRepository(ReadingLog)
    private readonly logRepository: Repository<ReadingLog>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  private async getOrCreateGoal(userId: string): Promise<UserGoal> {
    let goal = await this.goalRepository.findOne({ where: { userId } });
    if (!goal) {
      goal = await this.goalRepository.save(
        this.goalRepository.create({ userId, dailyPages: 20, monthlyBooks: 2 }),
      );
    }
    return goal;
  }

  async getProgress(userId: string) {
    const goal = await this.getOrCreateGoal(userId);

    // Today's pages read
    const today = new Date().toISOString().split('T')[0];
    const todayRes = await this.logRepository
      .createQueryBuilder('log')
      .select('COALESCE(SUM(log.pagesRead), 0)', 'total')
      .where('log.userId = :userId AND log.date = :today', { userId, today })
      .getRawOne();
    const todayPages = parseInt(todayRes?.total ?? '0');

    // This month's completed books
    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    firstOfMonth.setHours(0, 0, 0, 0);

    const monthlyCompleted = await this.bookRepository.count({
      where: {
        userId,
        status: 'completed' as any,
        updatedAt: MoreThanOrEqual(firstOfMonth),
      },
    });

    const dailyProgress = Math.min(
      Math.round((todayPages / goal.dailyPages) * 100),
      100,
    );
    const monthlyProgress = Math.min(
      Math.round((monthlyCompleted / goal.monthlyBooks) * 100),
      100,
    );

    return {
      dailyGoal: goal.dailyPages,
      monthlyGoal: goal.monthlyBooks,
      todayPages,
      monthlyCompleted,
      dailyProgress,
      monthlyProgress,
    };
  }

  async update(userId: string, dto: UpdateGoalDto) {
    const goal = await this.getOrCreateGoal(userId);
    Object.assign(goal, dto);
    return this.goalRepository.save(goal);
  }
}
