import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { UserAchievement } from './entities/user-achievement.entity';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';
import { ReadingLog } from '../reading-logs/entities/reading-log.entity';
import { Streak } from '../streaks/entities/streak.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAchievement, User, Book, ReadingLog, Streak]),
  ],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
