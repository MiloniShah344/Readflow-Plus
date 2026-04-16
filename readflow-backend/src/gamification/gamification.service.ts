/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';
import { ReadingLog } from '../reading-logs/entities/reading-log.entity';
import { Streak } from '../streaks/entities/streak.entity';
import { UserAchievement } from './entities/user-achievement.entity';

// ─── Level definitions ───────────────────────────────────────────────────────
export const LEVEL_THRESHOLDS = [
  { level: 1, minXp: 0, maxXp: 100, name: 'Beginner Reader' },
  { level: 2, minXp: 100, maxXp: 250, name: 'Casual Reader' },
  { level: 3, minXp: 250, maxXp: 500, name: 'Page Turner' },
  { level: 4, minXp: 500, maxXp: 1000, name: 'Bookworm' },
  { level: 5, minXp: 1000, maxXp: 2000, name: 'Book Explorer' },
  { level: 6, minXp: 2000, maxXp: 3500, name: 'Story Hunter' },
  { level: 7, minXp: 3500, maxXp: 5000, name: 'Literature Fan' },
  { level: 8, minXp: 5000, maxXp: 7500, name: 'Bibliophile' },
  { level: 9, minXp: 7500, maxXp: 10000, name: 'Scholar' },
  { level: 10, minXp: 10000, maxXp: Infinity, name: 'Knowledge Machine' },
];

// ─── Achievement catalogue ───────────────────────────────────────────────────
export const ACHIEVEMENT_DEFINITIONS = [
  {
    key: 'FIRST_LOG',
    name: 'First Steps',
    description: 'Log your very first reading session',
    icon: '📖',
    xpReward: 25,
    category: 'reading',
  },
  {
    key: 'SESSIONS_10',
    name: 'Dedicated Reader',
    description: 'Log 10 reading sessions',
    icon: '📝',
    xpReward: 30,
    category: 'reading',
  },
  {
    key: 'SESSIONS_50',
    name: 'Reading Machine',
    description: 'Log 50 reading sessions',
    icon: '⚙️',
    xpReward: 100,
    category: 'reading',
  },
  {
    key: 'FIRST_BOOK',
    name: 'Book Finisher',
    description: 'Complete your first book',
    icon: '🏆',
    xpReward: 50,
    category: 'books',
  },
  {
    key: 'BOOKS_5',
    name: 'Bookworm',
    description: 'Complete 5 books',
    icon: '📚',
    xpReward: 100,
    category: 'books',
  },
  {
    key: 'BOOKS_10',
    name: 'Book Master',
    description: 'Complete 10 books',
    icon: '🎓',
    xpReward: 200,
    category: 'books',
  },
  {
    key: 'PAGES_100',
    name: 'Century Reader',
    description: 'Read 100 pages total',
    icon: '💯',
    xpReward: 20,
    category: 'pages',
  },
  {
    key: 'PAGES_1000',
    name: 'Thousand Pages',
    description: 'Read 1,000 pages total',
    icon: '🌟',
    xpReward: 100,
    category: 'pages',
  },
  {
    key: 'PAGES_5000',
    name: 'Page Devourer',
    description: 'Read 5,000 pages total',
    icon: '🔥',
    xpReward: 250,
    category: 'pages',
  },
  {
    key: 'PAGES_10000',
    name: 'Epic Reader',
    description: 'Read 10,000 pages total',
    icon: '👑',
    xpReward: 500,
    category: 'pages',
  },
  {
    key: 'STREAK_3',
    name: 'Hat Trick',
    description: 'Maintain a 3-day reading streak',
    icon: '🎩',
    xpReward: 30,
    category: 'streak',
  },
  {
    key: 'STREAK_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day reading streak',
    icon: '⚔️',
    xpReward: 75,
    category: 'streak',
  },
  {
    key: 'STREAK_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day reading streak',
    icon: '💎',
    xpReward: 300,
    category: 'streak',
  },
  {
    key: 'SPEED_READER',
    name: 'Speed Reader',
    description: 'Read 100+ pages in a single day',
    icon: '⚡',
    xpReward: 150,
    category: 'special',
  },
  {
    key: 'DEEP_FOCUS',
    name: 'Deep Focus',
    description: 'Achieve focus level 5 in 5 sessions',
    icon: '🧠',
    xpReward: 75,
    category: 'special',
  },
];

export type AchievementDef = (typeof ACHIEVEMENT_DEFINITIONS)[number];

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserAchievement)
    private readonly achievementRepo: Repository<UserAchievement>,
    @InjectRepository(ReadingLog)
    private readonly logRepo: Repository<ReadingLog>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(Streak)
    private readonly streakRepo: Repository<Streak>,
  ) {}

  // ── Level helpers ───────────────────────────────────────────────────────────
  getLevelInfo(xp: number) {
    let info = LEVEL_THRESHOLDS[0];
    for (const t of LEVEL_THRESHOLDS) {
      if (xp >= t.minXp) info = t;
      else break;
    }
    return info;
  }

  // ── Grant XP and handle level up ────────────────────────────────────────────
  async grantXP(userId: string, amount: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return { leveledUp: false, newLevel: null, newLevelName: null };

    const previousLevel = user.level ?? 1;
    user.xp = (user.xp ?? 0) + amount;

    const levelInfo = this.getLevelInfo(user.xp);
    user.level = levelInfo.level;
    await this.userRepo.save(user);

    const leveledUp = levelInfo.level > previousLevel;
    return {
      leveledUp,
      newLevel: leveledUp ? levelInfo.level : null,
      newLevelName: leveledUp ? levelInfo.name : null,
    };
  }

  // ── Check and unlock achievements ───────────────────────────────────────────
  async checkAchievements(userId: string): Promise<AchievementDef[]> {
    const existing = await this.achievementRepo.find({ where: { userId } });
    const existingKeys = new Set(existing.map((a) => a.achievementKey));

    // Fetch all needed stats in parallel
    const [totalSessions, completedBooks] = await Promise.all([
      this.logRepo.count({ where: { userId } }),
      this.bookRepo.count({ where: { userId, status: 'completed' as any } }),
    ]);

    const pagesRes = await this.logRepo
      .createQueryBuilder('log')
      .select('COALESCE(SUM(log.pagesRead), 0)', 'total')
      .where('log.userId = :userId', { userId })
      .getRawOne();
    const totalPages = parseInt(pagesRes?.total ?? '0');

    const streakData = await this.streakRepo.findOne({ where: { userId } });
    const longestStreak = streakData?.longestStreak ?? 0;

    // Max pages logged on any single calendar date
    const dailyPages = await this.logRepo
      .createQueryBuilder('log')
      .select('log.date', 'date')
      .addSelect('SUM(log.pagesRead)', 'total')
      .where('log.userId = :userId', { userId })
      .groupBy('log.date')
      .getRawMany();

    const maxPagesInOneDay =
      dailyPages.length > 0
        ? Math.max(...dailyPages.map((d) => parseInt(d.total ?? '0')))
        : 0;

    const focus5Count = await this.logRepo.count({
      where: { userId, focusLevel: 5 },
    });

    const newlyUnlocked: AchievementDef[] = [];

    for (const def of ACHIEVEMENT_DEFINITIONS) {
      if (existingKeys.has(def.key)) continue;

      let met = false;
      switch (def.key) {
        case 'FIRST_LOG':
          met = totalSessions >= 1;
          break;
        case 'SESSIONS_10':
          met = totalSessions >= 10;
          break;
        case 'SESSIONS_50':
          met = totalSessions >= 50;
          break;
        case 'FIRST_BOOK':
          met = completedBooks >= 1;
          break;
        case 'BOOKS_5':
          met = completedBooks >= 5;
          break;
        case 'BOOKS_10':
          met = completedBooks >= 10;
          break;
        case 'PAGES_100':
          met = totalPages >= 100;
          break;
        case 'PAGES_1000':
          met = totalPages >= 1000;
          break;
        case 'PAGES_5000':
          met = totalPages >= 5000;
          break;
        case 'PAGES_10000':
          met = totalPages >= 10000;
          break;
        case 'STREAK_3':
          met = longestStreak >= 3;
          break;
        case 'STREAK_7':
          met = longestStreak >= 7;
          break;
        case 'STREAK_30':
          met = longestStreak >= 30;
          break;
        case 'SPEED_READER':
          met = maxPagesInOneDay >= 100;
          break;
        case 'DEEP_FOCUS':
          met = focus5Count >= 5;
          break;
      }

      if (met) {
        await this.achievementRepo.save({ userId, achievementKey: def.key });
        // Grant achievement bonus XP directly (no recursion)
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (user) {
          user.xp = (user.xp ?? 0) + def.xpReward;
          user.level = this.getLevelInfo(user.xp).level;
          await this.userRepo.save(user);
        }
        newlyUnlocked.push(def);
      }
    }

    return newlyUnlocked;
  }

  // ── Full gamification data for GET /gamification/me ─────────────────────────
  async getGamificationData(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const xp = user.xp ?? 0;
    const currentLevel = this.getLevelInfo(xp);
    const nextLevel = LEVEL_THRESHOLDS[currentLevel.level] ?? currentLevel;

    const userAchievements = await this.achievementRepo.find({
      where: { userId },
    });
    const unlockedMap = new Map(
      userAchievements.map((a) => [a.achievementKey, a.unlockedAt]),
    );

    const achievements = ACHIEVEMENT_DEFINITIONS.map((def) => ({
      ...def,
      unlocked: unlockedMap.has(def.key),
      unlockedAt: unlockedMap.get(def.key) ?? null,
    }));

    return {
      xp,
      level: currentLevel.level,
      levelName: currentLevel.name,
      currentLevelMinXp: currentLevel.minXp,
      nextLevelXp: currentLevel.maxXp === Infinity ? xp : currentLevel.maxXp,
      achievements,
    };
  }
}
