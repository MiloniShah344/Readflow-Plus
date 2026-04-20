'use client';
import { Box, Typography, TextField, Button, CircularProgress, Skeleton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import ProgressBar from '@/components/ui/ProgressBar';
import { useGoals, useUpdateGoals } from '@/hooks/useGoals';
import { useLogs } from '@/hooks/useLogs';

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const { data: logs } = useLogs();
  const { mutate: updateGoals, isPending } = useUpdateGoals();

  const [editing, setEditing] = useState(false);
  const [dailyPages, setDailyPages] = useState('');
  const [monthlyBooks, setMonthlyBooks] = useState('');

  const startEdit = () => {
    setDailyPages(String(goals?.dailyGoal ?? 20));
    setMonthlyBooks(String(goals?.monthlyGoal ?? 2));
    setEditing(true);
  };

  const saveGoals = () => {
    const dp = parseInt(dailyPages);
    const mb = parseInt(monthlyBooks);
    if (isNaN(dp) || isNaN(mb) || dp < 1 || mb < 1) return;
    updateGoals({ dailyPages: dp, monthlyBooks: mb });
    setEditing(false);
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const CARD_CONFIGS = goals ? [
    {
      label: 'Daily Reading Goal',
      icon: '📖',
      progress: goals.dailyProgress,
      current: goals.todayPages,
      target: goals.dailyGoal,
      unit: 'pages',
      color: goals.dailyProgress >= 100 ? '#10b981' : '#7c3aed',
      bg: goals.dailyProgress >= 100 ? 'rgba(16,185,129,0.08)' : 'rgba(124,58,237,0.06)',
      border: goals.dailyProgress >= 100 ? 'rgba(16,185,129,0.25)' : 'rgba(124,58,237,0.2)',
      message: goals.dailyProgress >= 100
        ? '🎉 Daily goal smashed! Amazing!'
        : goals.dailyProgress >= 50
        ? '📈 Halfway there — keep it up!'
        : `📌 ${goals.dailyGoal - goals.todayPages} more pages to reach your daily goal`,
    },
    {
      label: 'Monthly Book Goal',
      icon: '📚',
      progress: goals.monthlyProgress,
      current: goals.monthlyCompleted,
      target: goals.monthlyGoal,
      unit: 'books',
      color: goals.monthlyProgress >= 100 ? '#10b981' : '#f59e0b',
      bg: goals.monthlyProgress >= 100 ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.06)',
      border: goals.monthlyProgress >= 100 ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.2)',
      message: goals.monthlyProgress >= 100
        ? '🏆 Monthly goal achieved!'
        : `📚 ${goals.monthlyGoal - goals.monthlyCompleted} more book${goals.monthlyGoal - goals.monthlyCompleted !== 1 ? 's' : ''} to complete this month`,
    },
  ] : [];

  return (
    <Box>
      <TopBar title="Goals" />
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 900 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>🎯 Reading Goals</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>{todayStr}</Typography>
          </Box>

          {!editing ? (
            <Button
              startIcon={<EditIcon />}
              onClick={startEdit}
              variant="outlined"
              sx={{ borderColor: 'rgba(124,58,237,0.3)', color: '#a78bfa', '&:hover': { borderColor: '#7c3aed', bgcolor: 'rgba(124,58,237,0.1)' } }}
            >
              Edit Goals
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => setEditing(false)} color="inherit" sx={{ color: 'text.secondary' }}>
                Cancel
              </Button>
              <Button
                startIcon={isPending ? <CircularProgress size={14} color="inherit" /> : <CheckIcon />}
                onClick={saveGoals}
                variant="contained"
                disabled={isPending}
              >
                Save Goals
              </Button>
            </Box>
          )}
        </Box>

        {/* Edit form */}
        {editing && (
          <Box sx={{
            mb: 4, p: 3, borderRadius: 3,
            border: '1px solid rgba(124,58,237,0.25)',
            bgcolor: 'rgba(124,58,237,0.06)',
          }}>
            <Typography sx={{ fontWeight: 700, mb: 2.5, color: 'text.primary' }}>Update Your Targets</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Daily pages target" type="number"
                value={dailyPages} onChange={(e) => setDailyPages(e.target.value)}
                size="small" slotProps={{ htmlInput: {min: 1, max: 1000} }}
                helperText="Pages you aim to read per day"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                label="Monthly books target" type="number"
                value={monthlyBooks} onChange={(e) => setMonthlyBooks(e.target.value)}
                size="small" slotProps={{ htmlInput: {min: 1, max: 100} }}
                helperText="Books to complete this month"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
          </Box>
        )}

        {/* Goal cards */}
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3, bgcolor: 'rgba(124,58,237,0.08)' }} />
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3, bgcolor: 'rgba(124,58,237,0.08)' }} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {CARD_CONFIGS.map((card) => (
              <Box key={card.label} sx={{
                p: 3.5, borderRadius: 3,
                bgcolor: card.bg, border: `1px solid ${card.border}`,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: `0 8px 32px ${card.border}` },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ fontSize: 28 }}>{card.icon}</Typography>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{card.label}</Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{card.message}</Typography>
                    </Box>
                  </Box>

                  {/* Circle indicator */}
                  <Box sx={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                    <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="6" />
                      <circle cx="36" cy="36" r="28" fill="none" stroke={card.color} strokeWidth="6"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - card.progress / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                      />
                    </svg>
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: 16, fontWeight: 900, color: card.color, lineHeight: 1 }}>{card.progress}%</Typography>
                    </Box>
                  </Box>
                </Box>

                <ProgressBar
                  value={card.progress}
                  label={`${card.current} / ${card.target} ${card.unit}`}
                  height={10}
                  color={card.progress >= 100 ? 'success' : 'primary'}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Recent logs today */}
        {goals && goals.todayPages > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📝 Today&apos;s Sessions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {logs
                ?.filter((l) => l.date === new Date().toISOString().split('T')[0])
                .map((log) => (
                  <Box key={log.id} sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    px: 2.5, py: 1.5, borderRadius: 2,
                    border: '1px solid rgba(124,58,237,0.12)',
                    bgcolor: 'rgba(124,58,237,0.04)',
                  }}>
                    <Typography sx={{ fontSize: 14, color: 'text.primary', fontWeight: 600 }}>
                      {log.book?.title || 'Unknown'}
                    </Typography>
                    <Box sx={{ px: 1.5, py: 0.25, borderRadius: 10, bgcolor: 'rgba(124,58,237,0.15)' }}>
                      <Typography sx={{ fontSize: 12, color: '#a78bfa', fontWeight: 700 }}>
                        +{log.pagesRead} pages
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}