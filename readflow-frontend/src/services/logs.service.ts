import api from './api';
import { ReadingLog, CreateLogInput } from '@/types/log.types';

export const logsService = {
  async create(data: CreateLogInput): Promise<ReadingLog> {
    return api.post('/reading-logs', data, );
  },

  async getAll(params?: { bookId?: string; date?: string }): Promise<ReadingLog[]> {
    return api.get('/reading-logs', { params });
  },

  async getTotalPages(): Promise<number> {
    return api.get('/reading-logs/total-pages');
  },
};