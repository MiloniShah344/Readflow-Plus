import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingLogsController } from './reading-logs.controller';
import { ReadingLogsService } from './reading-logs.service';
import { ReadingLog } from './entities/reading-log.entity';
import { Book } from '../books/entities/book.entity';
import { StreaksModule } from '../streaks/streaks.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReadingLog, Book]),
    StreaksModule,
    GamificationModule,
  ],
  controllers: [ReadingLogsController],
  providers: [ReadingLogsService],
  exports: [ReadingLogsService],
})
export class ReadingLogsModule {}
