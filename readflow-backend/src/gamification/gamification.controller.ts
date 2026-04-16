import { Controller, Get } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('me')
  getMyGamification(@CurrentUser() user: User) {
    return this.gamificationService.getGamificationData(user.id);
  }
}
