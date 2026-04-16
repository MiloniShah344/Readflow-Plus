import { Controller, Get } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Get('me')
  getMyStreak(@CurrentUser() user: User) {
    return this.streaksService.getStreak(user.id);
  }
}
