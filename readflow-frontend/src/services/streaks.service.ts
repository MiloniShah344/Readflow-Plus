import api from './api';
import { Streak } from '@/types/streak.types';

export const streaksService = {
  async getMyStreak(): Promise<Streak> {
    return api.get('/streaks/me');
  },
};