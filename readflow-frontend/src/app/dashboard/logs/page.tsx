'use client';
import { Box, Typography, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TopBar from '@/components/layout/TopBar';
import EmptyState from '@/components/ui/EmptyState';
import { useLogs } from '@/hooks/useLogs';
import { useAppDispatch } from '@/store/hooks';
import { openLogModal } from '@/store/slices/uiSlice';
import { formatDate, formatMinutes } from '@/utils/formatters';
import { MOODS } from '@/constants/moods';

export default function LogsPage() {
  const dispatch = useAppDispatch();
  const { data: logs, isLoading } = useLogs();

  return (
    <Box>
      <TopBar title="Reading Logs" />
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>📝 Reading Sessions</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {logs?.length || 0} session{logs?.length !== 1 ? 's' : ''} logged
            </Typography>
          </Box>
          <Box
            onClick={() => dispatch(openLogModal(null))}
            sx={{
              display: 'flex', alignItems: 'center', gap: 0.75,
              px: 2.5, py: 1, borderRadius: 2, cursor: 'pointer',
              fontSize: 14, fontWeight: 600, color: '#fff',
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
              '&:hover': { boxShadow: '0 6px 20px rgba(124,58,237,0.6)' },
              transition: 'all 0.15s',
            }}
          >
            <AddIcon sx={{ fontSize: 18 }} /> Log Session
          </Box>
        </Box>

        {isLoading ? (
          <Typography sx={{ color: 'text.secondary' }}>Loading sessions...</Typography>
        ) : !logs?.length ? (
          <EmptyState icon="📖" title="No sessions logged" description="Start tracking your daily reading habit!"
            actionLabel="Log first session" onAction={() => dispatch(openLogModal(null))} />
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
            {logs.map((log) => {
              const mood = MOODS.find((m) => m.value === log.mood);
              return (
                <Box key={log.id} sx={{
                  p: 3, borderRadius: 3,
                  border: '1px solid rgba(124,58,237,0.12)',
                  bgcolor: 'rgba(124,58,237,0.03)',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: 'rgba(124,58,237,0.35)', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(124,58,237,0.15)' },
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>
                      {formatDate(log.date)}
                    </Typography>
                    <Typography sx={{ fontSize: 26, lineHeight: 1 }}>{mood?.emoji}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.25 }} noWrap>
                    {log.book?.title || 'Unknown book'}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }} noWrap>
                    by {log.book?.author}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip label={`📄 ${log.pagesRead} pages`} size="small"
                      sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: 'none', fontWeight: 600, fontSize: 11 }} />
                    {log.minutesSpent && (
                      <Chip label={`⏱️ ${formatMinutes(log.minutesSpent)}`} size="small"
                        sx={{ bgcolor: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'none', fontWeight: 600, fontSize: 11 }} />
                    )}
                    <Chip label={`🎯 ${log.focusLevel}/5`} size="small"
                      sx={{ bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'none', fontWeight: 600, fontSize: 11 }} />
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}