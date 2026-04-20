/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingLog } from '../reading-logs/entities/reading-log.entity';
import { Book } from '../books/entities/book.entity';

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

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

  async getInsights(
    userId: string,
  ): Promise<Array<{ type: string; message: string; icon: string }>> {
    const insights: Array<{ type: string; message: string; icon: string }> = [];

    // ── Weekend vs weekday ──────────────────────────────────────
    const [wkndRes, wkdayRes] = await Promise.all([
      this.logRepository
        .createQueryBuilder('log')
        .select('AVG(log.pagesRead)', 'avg')
        .addSelect('COUNT(*)', 'cnt')
        .where('log.userId = :userId', { userId })
        .andWhere('EXTRACT(DOW FROM log.date::date) IN (0, 6)')
        .getRawOne(),
      this.logRepository
        .createQueryBuilder('log')
        .select('AVG(log.pagesRead)', 'avg')
        .addSelect('COUNT(*)', 'cnt')
        .where('log.userId = :userId', { userId })
        .andWhere('EXTRACT(DOW FROM log.date::date) IN (1, 2, 3, 4, 5)')
        .getRawOne(),
    ]);

    const wkndAvg = parseFloat(wkndRes?.avg ?? '0');
    const wkdayAvg = parseFloat(wkdayRes?.avg ?? '0');
    const wkndCnt = parseInt(wkndRes?.cnt ?? '0');
    const wkdayCnt = parseInt(wkdayRes?.cnt ?? '0');

    if (wkndCnt >= 2 && wkdayCnt >= 2) {
      if (wkndAvg > wkdayAvg * 1.15) {
        const pct = Math.round(((wkndAvg - wkdayAvg) / wkdayAvg) * 100);
        insights.push({
          type: 'weekend',
          icon: '📅',
          message: `You read ${pct}% more pages on weekends — make the most of those days!`,
        });
      } else if (wkdayAvg > wkndAvg * 1.15) {
        const pct = Math.round(((wkdayAvg - wkndAvg) / wkndAvg) * 100);
        insights.push({
          type: 'weekday',
          icon: '💼',
          message: `You read ${pct}% more pages on weekdays — you're a true weekday warrior!`,
        });
      } else {
        insights.push({
          type: 'consistent',
          icon: '⚖️',
          message: 'You read consistently throughout the week — great balance!',
        });
      }
    }

    // ── Focus after 30 mins ────────────────────────────────────
    const [shortFocusRes, longFocusRes] = await Promise.all([
      this.logRepository
        .createQueryBuilder('log')
        .select('AVG(log.focusLevel)', 'avg')
        .addSelect('COUNT(*)', 'cnt')
        .where(
          'log.userId = :userId AND log.minutesSpent IS NOT NULL AND log.minutesSpent < 30',
          { userId },
        )
        .getRawOne(),
      this.logRepository
        .createQueryBuilder('log')
        .select('AVG(log.focusLevel)', 'avg')
        .addSelect('COUNT(*)', 'cnt')
        .where(
          'log.userId = :userId AND log.minutesSpent IS NOT NULL AND log.minutesSpent >= 30',
          { userId },
        )
        .getRawOne(),
    ]);

    const shortFocus = parseFloat(shortFocusRes?.avg ?? '0');
    const longFocus = parseFloat(longFocusRes?.avg ?? '0');
    const shortCnt = parseInt(shortFocusRes?.cnt ?? '0');
    const longCnt = parseInt(longFocusRes?.cnt ?? '0');

    if (shortCnt >= 2 && longCnt >= 2) {
      if (shortFocus > longFocus + 0.4) {
        insights.push({
          type: 'focus',
          icon: '⏱️',
          message:
            'Your focus is sharper in shorter sessions (< 30 min). Try Pomodoro-style reading sprints!',
        });
      } else if (longFocus > shortFocus + 0.3) {
        insights.push({
          type: 'focus',
          icon: '🧠',
          message:
            "You hit your peak focus in longer sessions (30+ min). You're a deep-work reader!",
        });
      }
    }

    // ── Best day of week ───────────────────────────────────────
    const dowData = await this.logRepository
      .createQueryBuilder('log')
      .select('EXTRACT(DOW FROM log.date::date)::int', 'dow')
      .addSelect('AVG(log.pagesRead)', 'avg')
      .addSelect('COUNT(*)', 'cnt')
      .where('log.userId = :userId', { userId })
      .groupBy('dow')
      .getRawMany();

    const validDow = dowData.filter((d) => parseInt(d.cnt) >= 2);
    if (validDow.length >= 3) {
      const best = validDow.reduce(
        (max, d) => (parseFloat(d.avg) > parseFloat(max.avg) ? d : max),
        validDow[0],
      );
      insights.push({
        type: 'best_day',
        icon: '🌟',
        message: `${DAYS[best.dow]} is your most productive reading day — plan your longest sessions then!`,
      });
    }

    // ── Consistency ────────────────────────────────────────────
    const distinctDaysRes = await this.logRepository
      .createQueryBuilder('log')
      .select('COUNT(DISTINCT log.date)', 'days')
      .where('log.userId = :userId', { userId })
      .getRawOne();
    const distinctDays = parseInt(distinctDaysRes?.days ?? '0');

    if (distinctDays >= 14) {
      insights.push({
        type: 'consistency',
        icon: '🔥',
        message: `You've read on ${distinctDays} different days — consistency is building your reading habit!`,
      });
    } else if (distinctDays >= 7) {
      insights.push({
        type: 'consistency',
        icon: '📆',
        message: `${distinctDays} reading days logged — you're building a solid streak!`,
      });
    }

    // ── Avg pages per session ──────────────────────────────────
    const avgRes = await this.logRepository
      .createQueryBuilder('log')
      .select('AVG(log.pagesRead)', 'avg')
      .addSelect('COUNT(*)', 'cnt')
      .where('log.userId = :userId', { userId })
      .getRawOne();
    const avgPages = Math.round(parseFloat(avgRes?.avg ?? '0'));
    const totalSessions = parseInt(avgRes?.cnt ?? '0');

    if (totalSessions >= 5 && avgPages >= 40) {
      insights.push({
        type: 'speed',
        icon: '⚡',
        message: `You average ${avgPages} pages per session across ${totalSessions} sessions — you're a reading powerhouse!`,
      });
    }

    // ── Mood trend ─────────────────────────────────────────────
    const moodCntRes = await this.logRepository
      .createQueryBuilder('log')
      .select('log.mood', 'mood')
      .addSelect('COUNT(*)', 'count')
      .where('log.userId = :userId', { userId })
      .groupBy('log.mood')
      .getRawMany();

    const total = moodCntRes.reduce((s, m) => s + parseInt(m.count), 0);
    const excitedEntry = moodCntRes.find((m) => m.mood === 'excited');
    const excitedCount = excitedEntry ? parseInt(excitedEntry.count) : 0;

    if (total >= 5 && excitedCount / total >= 0.5) {
      insights.push({
        type: 'mood',
        icon: '😄',
        message: `You feel excited in ${Math.round((excitedCount / total) * 100)}% of your sessions — your book choices are working!`,
      });
    }

    if (insights.length === 0) {
      insights.push({
        type: 'start',
        icon: '📖',
        message:
          'Log more reading sessions to unlock personalized insights about your reading habits!',
      });
    }

    return insights;
  }
}
