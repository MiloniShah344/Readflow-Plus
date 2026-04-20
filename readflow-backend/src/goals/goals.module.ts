import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { UserGoal } from './entities/user-goal.entity';
import { ReadingLog } from '../reading-logs/entities/reading-log.entity';
import { Book } from '../books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGoal, ReadingLog, Book])],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
