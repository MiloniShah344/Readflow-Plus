import { Book } from './book.types';

export type Mood = 'excited' | 'neutral' | 'bored';

export interface ReadingLog {
  id: string;
  pagesRead: number;
  minutesSpent: number | null;
  mood: Mood;
  focusLevel: number;
  date: string;
  bookId: string;
  userId: string;
  book?: Book;
  createdAt: string;
}

export interface CreateLogInput {
  bookId: string;
  pagesRead: number;
  minutesSpent?: number;
  mood?: Mood;
  focusLevel?: number;
  date?: string;
}