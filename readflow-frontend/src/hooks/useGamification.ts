import { useQuery } from '@tanstack/react-query';
import { gamificationService } from '@/services/gamification.service';
import { useAppSelector } from '@/store/hooks';

export const GAMIFICATION_KEY = 'gamification';

export function useGamification() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: [GAMIFICATION_KEY],
    queryFn: () => gamificationService.getMyData(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60,
  });
}