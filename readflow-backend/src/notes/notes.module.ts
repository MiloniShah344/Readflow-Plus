import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { Book } from '../books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Book])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
