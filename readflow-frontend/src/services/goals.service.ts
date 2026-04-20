import api from './api';
import { GoalProgress, UpdateGoalInput } from '@/types/goals.types';

export const goalsService = {
  async getProgress(): Promise<GoalProgress> {
    return api.get('/goals/progress');
  },
  async update(data: UpdateGoalInput): Promise<GoalProgress> {
    return api.patch('/goals', data);
  },
};