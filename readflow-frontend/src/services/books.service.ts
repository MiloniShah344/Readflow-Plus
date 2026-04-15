import api from './api';
import { Book, BookStats, CreateBookInput, UpdateBookInput } from '@/types/book.types';

export const booksService = {
  async getAll(params?: { status?: string; genre?: string }): Promise<Book[]> {
    return api.get('/books', { params });
  },

  async getOne(id: string): Promise<Book> {
    return api.get(`/books/${id}`);
  },

  async getStats(): Promise<BookStats> {
    return api.get('/books/stats');
  },

  async create(data: CreateBookInput): Promise<Book> {
    return api.post('/books', data);
  },

  async update(id: string, data: UpdateBookInput): Promise<Book> {
    return api.patch(`/books/${id}`, data);
  },

  async remove(id: string): Promise<{ message: string }> {
    return api.delete(`/books/${id}`);
  },
};