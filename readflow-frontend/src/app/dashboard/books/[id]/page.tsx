'use client';
import { Box, Typography, Button, Chip, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import ProgressBar from '@/components/ui/ProgressBar';
import BookStatusBadge from '@/components/books/BookStatusBadge';
import Modal from '@/components/ui/Modal';
import BookForm from '@/components/books/BookForm';
import LogForm from '@/components/logs/LogForm';
import EmptyState from '@/components/ui/EmptyState';
import { useBook } from '@/hooks/useBooks';
import { useLogs } from '@/hooks/useLogs';
import { getProgressPercent, formatDate, formatMinutes } from '@/utils/formatters';
import { MOODS } from '@/constants/moods';
import { COVER_COLORS } from '@/constants/levels';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const { data: book, isLoading: bookLoading } = useBook(id);
  const { data: logs, isLoading: logsLoading } = useLogs({ bookId: id });

  if (bookLoading) return (
    <Box>
      <TopBar title="Book Detail" />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <CircularProgress sx={{ color: '#7c3aed' }} />
      </Box>
    </Box>
  );

  if (!book) return (
    <Box><TopBar title="Not Found" />
      <EmptyState icon="🔍" title="Book not found" description="This book doesn't exist or was deleted." actionLabel="Back to Library" onAction={() => router.push('/books')} />
    </Box>
  );

  const progress = getProgressPercent(book.currentPage, book.totalPages);
  const coverColor = book.coverColor || COVER_COLORS[book.title.charCodeAt(0) % COVER_COLORS.length];
  const totalPages = logs?.reduce((s, l) => s + l.pagesRead, 0) || 0;
  const totalMins = logs?.reduce((s, l) => s + (l.minutesSpent || 0), 0) || 0;

  return (
    <Box>
      <TopBar title="Book Detail" />
      <Box sx={{ px: 4, py: 3, maxWidth: 1200 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/books')}
          sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
          Back to Library
        </Button>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '320px 1fr' }, gap: 3 }}>
          {/* Left panel */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Cover */}
            <Box sx={{
              borderRadius: 3, overflow: 'hidden',
              border: '1px solid rgba(124,58,237,0.15)',
            }}>
              <Box sx={{
                height: 200,
                background: `linear-gradient(135deg, ${coverColor}99, ${coverColor}44)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{ fontSize: 80, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' }}>📖</Typography>
              </Box>
              <Box sx={{ p: 3, bgcolor: 'rgba(124,58,237,0.03)' }}>
                <Box sx={{ mb: 1.5 }}>
                  <BookStatusBadge status={book.status} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, lineHeight: 1.2 }}>
                  {book.title}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 2 }}>by {book.author}</Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {book.genre && <Chip label={book.genre} size="small" sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: 'none' }} />}
                  {book.difficulty && <Chip label={book.difficulty} size="small" variant="outlined" sx={{ borderColor: 'rgba(124,58,237,0.3)', color: 'text.secondary' }} />}
                </Box>

                {book.totalPages && (
                  <Box sx={{ mb: 2 }}>
                    <ProgressBar value={progress} label={`${book.currentPage} / ${book.totalPages} pages`} height={8} color={book.status === 'completed' ? 'success' : 'primary'} />
                  </Box>
                )}

                {/* Stats row */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                  {[
                    { label: 'Sessions', value: logs?.length || 0 },
                    { label: 'Pages Read', value: totalPages },
                    ...(totalMins > 0 ? [{ label: 'Time Spent', value: formatMinutes(totalMins) }] : []),
                  ].map((s) => (
                    <Box key={s.label} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.12)' }}>
                      <Typography sx={{ fontSize: 10, color: 'text.secondary', mb: 0.25, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 800, color: '#a78bfa' }}>{s.value}</Typography>
                    </Box>
                  ))}
                </Box>

                {book.whyIWantToRead && (
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', mb: 2 }}>
                    <Typography sx={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, mb: 0.5 }}>🎯 WHY I WANT TO READ THIS</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>{book.whyIWantToRead}</Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                  {(book.status === 'in_progress' || book.status === 'to_read') && (
                    <Button variant="contained" fullWidth onClick={() => setIsLogging(true)} sx={{ borderRadius: 2 }}>
                      📖 Log Session
                    </Button>
                  )}
                  <Button variant="outlined" onClick={() => setIsEditing(true)}
                    sx={{ borderRadius: 2, borderColor: 'rgba(124,58,237,0.3)', color: '#a78bfa', minWidth: 0, px: 2, '&:hover': { borderColor: '#7c3aed', bgcolor: 'rgba(124,58,237,0.1)' } }}>
                    <EditIcon sx={{ fontSize: 18 }} />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right: Sessions */}
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, mb: 2 }}>📝 Reading Sessions</Typography>
            {logsLoading
              ? <CircularProgress sx={{ color: '#7c3aed' }} />
              : !logs?.length
              ? <Box sx={{ borderRadius: 3, border: '1px solid rgba(124,58,237,0.15)', bgcolor: 'rgba(124,58,237,0.02)' }}>
                  <EmptyState icon="📖" title="No sessions yet" description="Start tracking your reading!" actionLabel="Log first session" onAction={() => setIsLogging(true)} />
                </Box>
              : <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {logs.map((log) => {
                    const mood = MOODS.find((m) => m.value === log.mood);
                    return (
                      <Box key={log.id} sx={{
                        p: 2.5, borderRadius: 3,
                        border: '1px solid rgba(124,58,237,0.12)',
                        bgcolor: 'rgba(124,58,237,0.03)',
                        '&:hover': { borderColor: 'rgba(124,58,237,0.3)', bgcolor: 'rgba(124,58,237,0.06)' },
                        transition: 'all 0.15s',
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'text.primary', mb: 0.25 }}>
                              {log.pagesRead} pages read
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                              {formatDate(log.date)}
                              {log.minutesSpent ? ` · ${formatMinutes(log.minutesSpent)}` : ''}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ fontSize: 28, lineHeight: 1, mb: 0.5 }}>{mood?.emoji}</Typography>
                            <Box sx={{ px: 1, py: 0.25, borderRadius: 10, bgcolor: 'rgba(124,58,237,0.1)' }}>
                              <Typography sx={{ fontSize: 10, color: '#a78bfa', fontWeight: 700 }}>Focus {log.focusLevel}/5</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
            }
          </Box>
        </Box>
      </Box>

      <Modal open={isEditing} onClose={() => setIsEditing(false)} title="✏️ Edit Book">
        <BookForm book={book} onSuccess={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
      </Modal>
      <Modal open={isLogging} onClose={() => setIsLogging(false)} title="📖 Log Session">
        <LogForm defaultBookId={book.id} onSuccess={() => setIsLogging(false)} onCancel={() => setIsLogging(false)} />
      </Modal>
    </Box>
  );
}