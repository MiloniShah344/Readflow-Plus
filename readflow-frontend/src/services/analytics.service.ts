import api from './api';
import { AnalyticsSummary, Insight } from '@/types/analytics.types';

export const analyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    return api.get('/analytics/summary');
  },
  async getInsights(): Promise<Insight[]> {
    return api.get('/analytics/insights');
  },
};