/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingLog } from '../reading-logs/entities/reading-log.entity';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(ReadingLog)
    private readonly logRepository: Repository<ReadingLog>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async getSummary(userId: string) {
    // ── Total pages ──────────────────────────────────────
    const pagesRes = await this.logRepository
      .createQueryBuilder('log')
      .select('COALESCE(SUM(log.pagesRead), 0)', 'total')
      .where('log.userId = :userId', { userId })
      .getRawOne();
    const totalPages = parseInt(pagesRes?.total ?? '0');

    // ── Total minutes ────────────────────────────────────
    const minutesRes = await this.logRepository
      .createQueryBuilder('log')
      .select('COALESCE(SUM(log.minutesSpent), 0)', 'total')
      .where('log.userId = :userId AND log.minutesSpent IS NOT NULL', {
        userId,
      })
      .getRawOne();
    const totalMinutes = parseInt(minutesRes?.total ?? '0');

    // ── Avg speed (pages/hour) ───────────────────────────
    const avgSpeed =
      totalMinutes > 0 ? Math.round((totalPages / totalMinutes) * 60) : 0;

    // ── Completed books ──────────────────────────────────
    const completedBooks = await this.bookRepository.count({
      where: { userId, status: 'completed' as any },
    });

    // ── Total sessions ───────────────────────────────────
    const totalSessions = await this.logRepository.count({ where: { userId } });

    // ── Average focus ────────────────────────────────────
    const focusRes = await this.logRepository
      .createQueryBuilder('log')
      .select('COALESCE(AVG(log.focusLevel), 0)', 'avg')
      .where('log.userId = :userId', { userId })
      .getRawOne();
    const avgFocus = parseFloat(parseFloat(focusRes?.avg ?? '0').toFixed(1));

    // ── Pages by day of week (0=Sun … 6=Sat) ────────────
    const byDow = await this.logRepository
      .createQueryBuilder('log')
      .select('EXTRACT(DOW FROM log.date::date)::int', 'dow')
      .addSelect('COALESCE(SUM(log.pagesRead), 0)', 'pages')
      .where('log.userId = :userId', { userId })
      .groupBy('dow')
      .orderBy('dow', 'ASC')
      .getRawMany();

    const pagesByDayOfWeek: number[] = Array(7).fill(0);
    byDow.forEach((r) => {
      pagesByDayOfWeek[r.dow] = parseInt(r.pages ?? '0');
    });

    // ── Mood distribution ────────────────────────────────
    const moodRes = await this.logRepository
      .createQueryBuilder('log')
      .select('log.mood', 'mood')
      .addSelect('COUNT(*)', 'count')
      .where('log.userId = :userId', { userId })
      .groupBy('log.mood')
      .getRawMany();

    const moodDistribution: Record<string, number> = {
      excited: 0,
      neutral: 0,
      bored: 0,
    };
    moodRes.forEach((r) => {
      moodDistribution[r.mood] = parseInt(r.count ?? '0');
    });

    // ── Heatmap data (pages per date) ────────────────────
    const byDate = await this.logRepository
      .createQueryBuilder('log')
      .select('log.date::text', 'date')
      .addSelect('COALESCE(SUM(log.pagesRead), 0)', 'count')
      .where('log.userId = :userId', { userId })
      .groupBy('log.date')
      .orderBy('log.date', 'ASC')
      .getRawMany();

    const heatmapData = byDate.map((r) => ({
      date: r.date,
      count: parseInt(r.count ?? '0'),
    }));

    return {
      totalPages,
      totalMinutes,
      avgSpeed,
      completedBooks,
      totalSessions,
      avgFocus,
      pagesByDayOfWeek,
      moodDistribution,
      heatmapData,
    };
  }
}
