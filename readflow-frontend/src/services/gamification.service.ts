import api from './api';
import { GamificationData } from '@/types/gamification.types';

export const gamificationService = {
  async getMyData(): Promise<GamificationData> {
    return api.get('/gamification/me');
  },
};