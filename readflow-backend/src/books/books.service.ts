import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookStatus } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findAll(
    userId: string,
    status?: BookStatus,
    genre?: string,
  ): Promise<Book[]> {
    const query = this.bookRepository
      .createQueryBuilder('book')
      .where('book.userId = :userId', { userId })
      .orderBy('book.createdAt', 'DESC');

    if (status) {
      query.andWhere('book.status = :status', { status });
    }

    if (genre) {
      query.andWhere('book.genre ILIKE :genre', { genre: `%${genre}%` });
    }

    return query.getMany();
  }

  async findOne(id: string, userId: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id, userId },
      relations: ['readingLogs'],
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async create(userId: string, dto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create({
      ...dto,
      userId,
    });

    return this.bookRepository.save(book);
  }

  async update(id: string, userId: string, dto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.userId !== userId) {
      throw new ForbiddenException('You do not own this book');
    }

    Object.assign(book, dto);
    return this.bookRepository.save(book);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.userId !== userId) {
      throw new ForbiddenException('You do not own this book');
    }

    await this.bookRepository.remove(book);
    return { message: 'Book deleted successfully' };
  }

  async getStats(userId: string) {
    const books = await this.bookRepository.find({ where: { userId } });

    return {
      total: books.length,
      completed: books.filter((b) => b.status === BookStatus.COMPLETED).length,
      inProgress: books.filter((b) => b.status === BookStatus.IN_PROGRESS)
        .length,
      toRead: books.filter((b) => b.status === BookStatus.TO_READ).length,
      dropped: books.filter((b) => b.status === BookStatus.DROPPED).length,
    };
  }
}
