import { GamificationResult } from '@/types/gamification.types';
import api from './api';
import { ReadingLog, CreateLogInput } from '@/types/log.types';

export const logsService = {
  async create(data: CreateLogInput): Promise<{ log: ReadingLog } & GamificationResult> {
    return api.post('/reading-logs', data, );
  },

  async getAll(params?: { bookId?: string; date?: string }): Promise<ReadingLog[]> {
    return api.get('/reading-logs', { params });
  },

  async getTotalPages(): Promise<number> {
    return api.get('/reading-logs/total-pages');
  },
};