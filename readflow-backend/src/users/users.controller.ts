import { Controller, Get, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: User, @Body() dto: UpdateMeDto) {
    return this.usersService.update(user.id, dto);
  }
}
