import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsService } from '@/services/goals.service';
import { UpdateGoalInput } from '@/types/goals.types';
import { ANALYTICS_KEY } from './useAnalytics';
import toast from 'react-hot-toast';

export const GOALS_KEY = 'goals';

export function useGoals() {
  return useQuery({
    queryKey: [GOALS_KEY],
    queryFn: () => goalsService.getProgress(),
    staleTime: 1000 * 60,
  });
}

export function useUpdateGoals() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGoalInput) => goalsService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [GOALS_KEY] });
      qc.invalidateQueries({ queryKey: [ANALYTICS_KEY] });
      toast.success('🎯 Goals updated!');
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to update goals'),
  });
}