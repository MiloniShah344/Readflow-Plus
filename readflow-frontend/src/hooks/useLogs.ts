import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logsService } from "@/services/logs.service";
import { CreateLogInput } from "@/types/log.types";
import { BOOKS_KEY } from "./useBooks";
import { ANALYTICS_KEY } from "./useAnalytics";
import { STREAKS_KEY } from "./useStreaks";
import { GAMIFICATION_KEY } from "./useGamification";
import toast from "react-hot-toast";

export const LOGS_KEY = "reading-logs";

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
    onSuccess: (response) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: [LOGS_KEY] });
      queryClient.invalidateQueries({ queryKey: [BOOKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [ANALYTICS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STREAKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [GAMIFICATION_KEY] });

      // Base XP toast
      toast.success(`📖 Session logged! +${response.xpGained} XP`, {
        duration: 3000,
      });

      // Level up toast
      if (response.leveledUp) {
        setTimeout(() => {
          toast.success(
            `🎉 Level Up! You're now Level ${response.newLevel} — ${response.newLevelName}!`,
            { duration: 6000, icon: "🏅" },
          );
        }, 400);
      }

      // Achievement toasts (staggered)
      response.newAchievements?.forEach((achievement, i) => {
        setTimeout(
          () => {
            toast.success(
              `🏆 Achievement: ${achievement.icon} ${achievement.name} (+${achievement.xpReward} XP)`,
              { duration: 6000 },
            );
          },
          800 + i * 600,
        );
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to log session");
    },
  });
}
