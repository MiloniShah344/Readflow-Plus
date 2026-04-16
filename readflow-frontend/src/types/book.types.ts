export type BookStatus = 'to_read' | 'in_progress' | 'completed' | 'dropped';
export type BookDifficulty = 'easy' | 'medium' | 'hard';

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number | null;
  status: BookStatus;
  rating: number | null;
  difficulty: BookDifficulty | null;
  expectedCompletionDate: string | null;
  whyIWantToRead: string | null;
  genre: string | null;
  coverColor: string | null;
  currentPage: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookInput {
  title: string;
  author: string;
  totalPages?: number;
  status?: BookStatus;
  rating?: number;
  difficulty?: BookDifficulty;
  expectedCompletionDate?: string;
  whyIWantToRead?: string;
  genre?: string;
  coverColor?: string;
}

export interface UpdateBookInput extends Partial<CreateBookInput> {
  currentPage?: number;
  status?: BookStatus;
}

export interface BookStats {
  total: number;
  completed: number;
  inProgress: number;
  toRead: number;
  dropped: number;
}