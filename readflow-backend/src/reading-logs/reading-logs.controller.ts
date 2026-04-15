import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ReadingLogsService } from './reading-logs.service';
import { CreateReadingLogDto } from './dto/create-reading-log.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('reading-logs')
export class ReadingLogsController {
  constructor(private readonly readingLogsService: ReadingLogsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateReadingLogDto) {
    return this.readingLogsService.create(user.id, dto);
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('bookId') bookId?: string,
    @Query('date') date?: string,
  ) {
    return this.readingLogsService.findAll(user.id, bookId, date);
  }

  @Get('total-pages')
  getTotalPages(@CurrentUser() user: User) {
    return this.readingLogsService.getTotalPages(user.id);
  }
}