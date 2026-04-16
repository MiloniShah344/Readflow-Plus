export interface GamificationAchievement {
  key: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  category: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface GamificationData {
  xp: number;
  level: number;
  levelName: string;
  currentLevelMinXp: number;
  nextLevelXp: number;
  achievements: GamificationAchievement[];
}

export interface NewAchievement {
  key: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
}

export interface GamificationResult {
  xpGained?: number;
  newAchievements: NewAchievement[];
  leveledUp: boolean;
  newLevel: number | null;
  newLevelName: string | null;
}