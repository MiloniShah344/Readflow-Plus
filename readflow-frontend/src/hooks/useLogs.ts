import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logsService } from '@/services/logs.service';
import { CreateLogInput } from '@/types/log.types';
import { BOOKS_KEY } from './useBooks';
import { ANALYTICS_KEY } from './useAnalytics';
import { STREAKS_KEY } from './useStreaks';
import toast from 'react-hot-toast';

export const LOGS_KEY = 'reading-logs';

export function useLogs(params?: { bookId?: string; date?: string }) {
  return useQuery({
    queryKey: [LOGS_KEY, params],
    queryFn: () => logsService.getAll(params),
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLogInput) => logsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LOGS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STREAKS_KEY] });
      toast.success('📖 Reading session logged! +10 XP');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to log session');
    },
  });
}