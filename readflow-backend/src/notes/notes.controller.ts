import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateNoteDto) {
    return this.notesService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query('bookId') bookId: string) {
    return this.notesService.findAllByBook(user.id, bookId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notesService.remove(id, user.id);
  }
}
