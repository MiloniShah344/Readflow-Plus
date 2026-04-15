import { LEVELS } from '@/constants/levels';

export function getLevelInfo(xp: number) {
  const levelInfo = LEVELS.find((l) => xp >= l.minXp && xp < l.maxXp);
  return levelInfo || LEVELS[LEVELS.length - 1];
}

export function getProgressPercent(currentPage: number, totalPages: number | null): number {
  if (!totalPages || totalPages === 0) return 0;
  return Math.min(Math.round((currentPage / totalPages) * 100), 100);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMinutes(minutes: number): string {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    to_read: 'To Read',
    in_progress: 'In Progress',
    completed: 'Completed',
    dropped: 'Dropped',
  };
  return labels[status] || status;
}