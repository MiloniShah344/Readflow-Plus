export interface Streak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
  freezeAvailable: boolean;
  comebackDate: string | null;
  updatedAt: string;
}