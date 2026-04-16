import { useQuery } from '@tanstack/react-query';
import { streaksService } from '@/services/streaks.service';
import { useAppSelector } from '@/store/hooks';

export const STREAKS_KEY = 'streaks';

export function useStreak() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: [STREAKS_KEY],
    queryFn: () => streaksService.getMyStreak(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });
}