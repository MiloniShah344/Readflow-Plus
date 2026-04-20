import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { ReadingLogsModule } from './reading-logs/reading-logs.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { User } from './users/entities/user.entity';
import { Book } from './books/entities/book.entity';
import { ReadingLog } from './reading-logs/entities/reading-log.entity';
import { StreaksModule } from './streaks/streaks.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { Streak } from './streaks/entities/streak.entity';
import { GamificationModule } from './gamification/gamification.module';
import { UserAchievement } from './gamification/entities/user-achievement.entity';
import { NotesModule } from './notes/notes.module';
import { GoalsModule } from './goals/goals.module';
import { Note } from './notes/entities/note.entity';
import { UserGoal } from './goals/entities/user-goal.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url:
          process.env.DATABASE_URL ??
          'postgresql://postgres:Readflow2026@db.adxqtfxzsnnvawipvhkr.supabase.co:5432/postgres',
        entities: [
          User,
          Book,
          ReadingLog,
          Streak,
          UserAchievement,
          Note,
          UserGoal,
        ],
        synchronize: true,
        ssl: { rejectUnauthorized: false },
        logging: process.env.NODE_ENV === 'development',
        extra: {
          connectionTimeoutMillis: 5000,
        },
      }),
    }),
    AuthModule,
    UsersModule,
    BooksModule,
    ReadingLogsModule,
    StreaksModule,
    AnalyticsModule,
    GamificationModule,
    NotesModule,
    GoalsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
