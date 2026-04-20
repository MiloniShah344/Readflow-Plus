import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary(@CurrentUser() user: User) {
    return this.analyticsService.getSummary(user.id);
  }

  @Get('insights')
  getInsights(@CurrentUser() user: User) {
    return this.analyticsService.getInsights(user.id);
  }
}
