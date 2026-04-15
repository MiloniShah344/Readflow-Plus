'use client';
import { Box, Typography, Skeleton } from '@mui/material';
import TopBar from '@/components/layout/TopBar';
import BookCard from '@/components/books/BookCard';
import EmptyState from '@/components/ui/EmptyState';
import { useBooks, useBookStats } from '@/hooks/useBooks';
import { useLogs } from '@/hooks/useLogs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openAddBookModal, openLogModal } from '@/store/slices/uiSlice';
import { formatDate, formatMinutes } from '@/utils/formatters';
import { MOODS } from '@/constants/moods';

const STAT_CARDS = [
  { key: 'total',      label: 'Total Books',  icon: '📚', grad: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(124,58,237,0.1))', border: 'rgba(124,58,237,0.3)', iconColor: '#a78bfa' },
  { key: 'completed',  label: 'Completed',    icon: '✅', grad: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))', border: 'rgba(16,185,129,0.3)', iconColor: '#10b981' },
  { key: 'inProgress', label: 'In Progress',  icon: '📖', grad: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))', border: 'rgba(245,158,11,0.3)', iconColor: '#f59e0b' },
  { key: 'toRead',     label: 'To Read',      icon: '📌', grad: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))', border: 'rgba(239,68,68,0.25)', iconColor: '#ef4444' },
];

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { data: stats, isLoading: statsLoading } = useBookStats();
  const { data: inProgress, isLoading: booksLoading } = useBooks({ status: 'in_progress' });
  const { data: recentLogs, isLoading: logsLoading } = useLogs();
  const recent5 = recentLogs?.slice(0, 5);

  return (
    <Box>
      <TopBar title="Dashboard" />
      <Box sx={{ px: 4, py: 3, maxWidth: 1400 }}>

        {/* Welcome */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
            Good {getGreeting()}, {user?.email?.split('@')[0] || 'reader'} 👋
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Ready to turn some pages today?
          </Typography>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 2, mb: 4 }}>
          {statsLoading
            ? [1,2,3,4].map((i) => <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 3, bgcolor: 'rgba(124,58,237,0.08)' }} />)
            : STAT_CARDS.map((s) => (
              <Box key={s.key} sx={{
                p: 2.5, borderRadius: 3,
                background: s.grad,
                border: `1px solid ${s.border}`,
                display: 'flex', flexDirection: 'column', gap: 1,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: 22 }}>{s.icon}</Typography>
                </Box>
                <Typography sx={{ fontSize: 32, fontWeight: 800, color: s.iconColor, lineHeight: 1 }}>
                  {stats?.[s.key as keyof typeof stats] ?? 0}
                </Typography>
              </Box>
            ))
          }
        </Box>

        {/* Two columns */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 360px' }, gap: 3 }}>
          {/* Currently Reading */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>📖 Currently Reading</Typography>
              <Box
                onClick={() => dispatch(openAddBookModal())}
                sx={{
                  px: 2, py: 0.75, borderRadius: 2, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: '#fff', boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
                  '&:hover': { boxShadow: '0 6px 18px rgba(124,58,237,0.6)' },
                }}
              >
                + Add Book
              </Box>
            </Box>
            {booksLoading
              ? <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3, bgcolor: 'rgba(124,58,237,0.08)' }} />
              : !inProgress?.length
              ? <Box sx={{ borderRadius: 3, border: '1px solid rgba(124,58,237,0.15)', bgcolor: 'rgba(124,58,237,0.03)' }}>
                  <EmptyState icon="📚" title="Nothing in progress" description="Add a book and start your journey!" actionLabel="Add book" onAction={() => dispatch(openAddBookModal())} />
                </Box>
              : <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
                  {inProgress.map((book) => <BookCard key={book.id} book={book} />)}
                </Box>
            }
          </Box>

          {/* Recent Sessions */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>📝 Recent Sessions</Typography>
              <Box
                onClick={() => dispatch(openLogModal(null))}
                sx={{
                  px: 2, py: 0.75, borderRadius: 2, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  bgcolor: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
                  color: '#a78bfa',
                  '&:hover': { bgcolor: 'rgba(124,58,237,0.2)' },
                }}
              >
                + Log
              </Box>
            </Box>

            <Box sx={{ borderRadius: 3, border: '1px solid rgba(124,58,237,0.15)', bgcolor: 'rgba(124,58,237,0.02)', overflow: 'hidden' }}>
              {logsLoading
                ? [1,2,3].map((i) => <Skeleton key={i} variant="rectangular" height={64} sx={{ m: 1, borderRadius: 2, bgcolor: 'rgba(124,58,237,0.08)' }} />)
                : !recent5?.length
                ? <EmptyState icon="📖" title="No sessions yet" description="Log your first reading session!" />
                : recent5.map((log, i) => {
                    const mood = MOODS.find((m) => m.value === log.mood);
                    return (
                      <Box key={log.id} sx={{
                        px: 2, py: 1.5,
                        borderBottom: i < recent5.length - 1 ? '1px solid rgba(124,58,237,0.1)' : 'none',
                        '&:hover': { bgcolor: 'rgba(124,58,237,0.05)' },
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }} noWrap>
                              {log.book?.title || 'Unknown'}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                              {formatDate(log.date)} · {log.pagesRead} pages
                              {log.minutesSpent ? ` · ${formatMinutes(log.minutesSpent)}` : ''}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: 22, ml: 1 }}>{mood?.emoji}</Typography>
                        </Box>
                      </Box>
                    );
                  })
              }
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}