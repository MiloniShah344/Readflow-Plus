'use client';
import { Box, Typography, Tooltip } from '@mui/material';
import { useStreak } from '@/hooks/useStreaks';

export default function StreakCounter({ open }: { open: boolean }) {
  const { data: streak } = useStreak();

  if (!streak) return null;

  if (!open) {
    return (
      <Tooltip title={`🔥 ${streak.currentStreak} day streak`} placement="right">
        <Box sx={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          py: 1.5, cursor: 'default',
          position: 'relative',
        }}>
          <Typography sx={{ fontSize: 22 }}>🔥</Typography>
          {streak.currentStreak > 0 && (
            <Box sx={{
              position: 'absolute', top: 4, right: 4,
              width: 16, height: 16, borderRadius: '50%',
              bgcolor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Typography sx={{ fontSize: 9, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                {streak.currentStreak > 99 ? '99+' : streak.currentStreak}
              </Typography>
            </Box>
          )}
        </Box>
      </Tooltip>
    );
  }

  return (
    <Box sx={{
      mx: 1.5, mb: 1.5, p: 1.75,
      borderRadius: 2.5,
      background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,158,11,0.08))',
      border: '1px solid rgba(239,68,68,0.22)',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontSize: 10, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Streak
        </Typography>
        <Typography sx={{ fontSize: 18 }}>🔥</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 0.5 }}>
        <Typography sx={{ fontSize: 30, fontWeight: 900, color: '#ef4444', lineHeight: 1 }}>
          {streak.currentStreak}
        </Typography>
        <Typography sx={{ fontSize: 12, color: '#9990b8', fontWeight: 500 }}>days</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 11, color: '#9990b8' }}>
          🏆 Best: <Box component="span" sx={{ color: '#f59e0b', fontWeight: 700 }}>{streak.longestStreak}d</Box>
        </Typography>
        {streak.freezeAvailable && (
          <Tooltip title="Streak freeze available!">
            <Typography sx={{ fontSize: 14 }}>🧊</Typography>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}