import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReadingLog } from '../../reading-logs/entities/reading-log.entity';

export enum BookStatus {
  TO_READ = 'to_read',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
}

export enum BookDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true, type: 'int' })
  totalPages: number;

  @Column({ type: 'enum', enum: BookStatus, default: BookStatus.TO_READ })
  status: BookStatus;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'enum', enum: BookDifficulty, nullable: true })
  difficulty: BookDifficulty;

  @Column({ nullable: true, type: 'date' })
  expectedCompletionDate: string;

  @Column({ nullable: true, type: 'text' })
  whyIWantToRead: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true, type: 'text' })
  coverColor: string;

  @Column({ default: 0, type: 'int' })
  currentPage: number;

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => ReadingLog, (log) => log.book)
  readingLogs: ReadingLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}