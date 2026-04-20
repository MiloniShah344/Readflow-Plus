import { Controller, Get, Patch, Body } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('progress')
  getProgress(@CurrentUser() user: User) {
    return this.goalsService.getProgress(user.id);
  }

  @Patch()
  update(@CurrentUser() user: User, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(user.id, dto);
  }
}
