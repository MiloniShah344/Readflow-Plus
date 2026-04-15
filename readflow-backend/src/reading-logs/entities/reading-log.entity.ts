import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

export enum Mood {
  EXCITED = 'excited',
  NEUTRAL = 'neutral',
  BORED = 'bored',
}

@Entity('reading_logs')
export class ReadingLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  pagesRead: number;

  @Column({ type: 'int', nullable: true })
  minutesSpent: number;

  @Column({ type: 'enum', enum: Mood, default: Mood.NEUTRAL })
  mood: Mood;

  @Column({ type: 'int', default: 3 })
  focusLevel: number;

  @Column({ type: 'date' })
  date: string;

  @ManyToOne(() => User, (user) => user.readingLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Book, (book) => book.readingLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column()
  bookId: string;

  @CreateDateColumn()
  createdAt: Date;
}