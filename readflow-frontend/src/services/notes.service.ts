import api from './api';
import { Note, CreateNoteInput, UpdateNoteInput } from '@/types/notes.types';

export const notesService = {
  async getByBook(bookId: string): Promise<Note[]> {
    return api.get('/notes', { params: { bookId } });
  },
  async create(data: CreateNoteInput): Promise<Note> {
    return api.post('/notes', data);
  },
  async update(id: string, data: UpdateNoteInput): Promise<Note> {
    return api.patch(`/notes/${id}`, data);
  },
  async remove(id: string): Promise<{ message: string }> {
    return api.delete(`/notes/${id}`);
  },
};