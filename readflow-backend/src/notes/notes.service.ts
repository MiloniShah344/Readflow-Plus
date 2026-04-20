import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { Book } from '../books/entities/book.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(userId: string, dto: CreateNoteDto): Promise<Note> {
    const book = await this.bookRepository.findOne({
      where: { id: dto.bookId, userId },
    });
    if (!book)
      throw new NotFoundException('Book not found or does not belong to you');

    const note = this.noteRepository.create({
      ...dto,
      userId,
      isHighlight: dto.isHighlight ?? false,
    });
    return this.noteRepository.save(note);
  }

  async findAllByBook(userId: string, bookId: string): Promise<Note[]> {
    return this.noteRepository.find({
      where: { userId, bookId },
      order: { isHighlight: 'DESC', createdAt: 'DESC' },
    });
  }

  async update(id: string, userId: string, dto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteRepository.findOne({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId)
      throw new ForbiddenException('You do not own this note');

    Object.assign(note, dto);
    return this.noteRepository.save(note);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const note = await this.noteRepository.findOne({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId)
      throw new ForbiddenException('You do not own this note');

    await this.noteRepository.remove(note);
    return { message: 'Note deleted' };
  }
}
