import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import { useAppSelector } from '@/store/hooks';

export const ANALYTICS_KEY = 'analytics';

export function useAnalytics() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: [ANALYTICS_KEY],
    queryFn: () => analyticsService.getSummary(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
}