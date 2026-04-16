import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Streak } from './entities/streak.entity';

@Injectable()
export class StreaksService {
  constructor(
    @InjectRepository(Streak)
    private readonly streakRepository: Repository<Streak>,
  ) {}

  async getStreak(userId: string): Promise<Streak> {
    let streak = await this.streakRepository.findOne({ where: { userId } });
    if (!streak) {
      streak = this.streakRepository.create({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastReadDate: null,
        freezeAvailable: true,
        comebackDate: null,
      });
      await this.streakRepository.save(streak);
    }
    return streak;
  }

  async checkAndUpdateStreak(userId: string, logDate: string): Promise<Streak> {
    let streak = await this.streakRepository.findOne({ where: { userId } });

    // First-ever log
    if (!streak) {
      streak = this.streakRepository.create({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastReadDate: logDate,
        freezeAvailable: true,
        comebackDate: null,
      });
      return this.streakRepository.save(streak);
    }

    // No previous date
    if (!streak.lastReadDate) {
      streak.currentStreak = 1;
      streak.longestStreak = Math.max(streak.longestStreak, 1);
      streak.lastReadDate = logDate;
      return this.streakRepository.save(streak);
    }

    // Calculate day difference
    const last = new Date(streak.lastReadDate + 'T00:00:00Z');
    const current = new Date(logDate + 'T00:00:00Z');
    const diffMs = current.getTime() - last.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already logged today — no change
      return streak;
    }

    if (diffDays < 0) {
      // Logging for a past date older than last read — ignore streak update
      return streak;
    }

    if (diffDays === 1) {
      // Consecutive day — increment
      streak.currentStreak += 1;
    } else {
      // Gap — streak broken
      if (streak.currentStreak > 0) {
        streak.comebackDate = new Date();
      }
      streak.currentStreak = 1;
    }

    streak.lastReadDate = logDate;

    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    return this.streakRepository.save(streak);
  }
}
