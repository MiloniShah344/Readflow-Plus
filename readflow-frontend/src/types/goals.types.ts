export interface GoalProgress {
  dailyGoal: number;
  monthlyGoal: number;
  todayPages: number;
  monthlyCompleted: number;
  dailyProgress: number;
  monthlyProgress: number;
}

export interface UpdateGoalInput {
  dailyPages?: number;
  monthlyBooks?: number;
}