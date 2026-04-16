export interface HeatmapDay {
  date: string;
  count: number;
}

export interface AnalyticsSummary {
  totalPages: number;
  totalMinutes: number;
  avgSpeed: number;
  completedBooks: number;
  totalSessions: number;
  avgFocus: number;
  pagesByDayOfWeek: number[];
  moodDistribution: Record<string, number>;
  heatmapData: HeatmapDay[];
}