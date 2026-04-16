import api from './api';
import { AnalyticsSummary } from '@/types/analytics.types';

export const analyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    return api.get('/analytics/summary');
  },
};