'use client';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Rating,
  Divider,
  CircularProgress,
} from '@mui/material';
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
import { useAppDispatch } from '@/store/hooks';
import { openLogModal } from '@/store/slices/uiSlice';
import { getProgressPercent, formatDate, formatMinutes } from '@/utils/formatters';
import { MOODS } from '@/constants/moods';
import { COVER_COLORS } from '@/constants/levels';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  const { data: book, isLoading: bookLoading } = useBook(id);
  const { data: logs, isLoading: logsLoading } = useLogs({ bookId: id });

  if (bookLoading) {
    return (
      <Box>
        <TopBar title="Book Detail" />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={400}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box>
        <TopBar title="Book Not Found" />
        <EmptyState
          icon="🔍"
          title="Book not found"
          description="This book doesn't exist or was deleted."
          actionLabel="Back to Library"
          onAction={() => router.push('/books')}
        />
      </Box>
    );
  }

  const progress = getProgressPercent(book.currentPage, book.totalPages);
  const coverColor =
    book.coverColor ||
    COVER_COLORS[book.title.charCodeAt(0) % COVER_COLORS.length];

  const totalPagesRead = logs?.reduce((sum, l) => sum + l.pagesRead, 0) || 0;
  const totalMinutes = logs?.reduce((sum, l) => sum + (l.minutesSpent || 0), 0) || 0;

  return (
    <Box>
      <TopBar title="Book Detail" />
      <Box sx={{ px: 4, py: 3 }}>
        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/books')}
          sx={{ mb: 3, borderRadius: 2 }}
          color="inherit"
        >
          Back to Library
        </Button>

        <Grid container spacing={3}>
          {/* Left: Book Info */}
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
            >
              {/* Cover */}
              <Box
                sx={{
                  height: 200,
                  background: `linear-gradient(135deg, ${coverColor}cc, ${coverColor}44)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 64,
                }}
              >
                📚
              </Box>

              <CardContent>
                <Box sx={{mb:2}}>
                  <BookStatusBadge status={book.status} />
                </Box>

                <Typography variant="h5" fontWeight={700} mb={0.5}>
                  {book.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  by {book.author}
                </Typography>

                {book.rating && (
                  <Rating value={book.rating} readOnly sx={{ mb: 2 }} />
                )}

                {book.genre && (
                  <Chip label={book.genre} size="small" sx={{ mb: 2 }} />
                )}

                {book.difficulty && (
                  <Chip
                    label={
                      book.difficulty === 'easy'
                        ? '🟢 Easy'
                        : book.difficulty === 'medium'
                        ? '🟡 Medium'
                        : '🔴 Hard'
                    }
                    size="small"
                    sx={{ ml: 1, mb: 2 }}
                    variant="outlined"
                  />
                )}

                <Divider sx={{ my: 2 }} />

                {book.totalPages && (
                  <Box sx={{mb:2}}>
                    <ProgressBar
                      value={progress}
                      label={`${book.currentPage} / ${book.totalPages} pages`}
                      height={8}
                      color={
                        book.status === 'completed' ? 'success' : 'primary'
                      }
                    />
                  </Box>
                )}

                <Grid container spacing={1} mb={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Sessions
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {logs?.length || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Pages read
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {totalPagesRead}
                    </Typography>
                  </Grid>
                  {totalMinutes > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        Total time
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        {formatMinutes(totalMinutes)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                {book.whyIWantToRead && (
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'action.hover',
                      mb: 2,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                      🎯 Why I want to read this
                    </Typography>
                    <Typography variant="body2" fontStyle="italic">
                      {book.whyIWantToRead}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 1 }}>
                  {(book.status === 'in_progress' || book.status === 'to_read') && (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setIsLogging(true)}
                      sx={{ borderRadius: 2 }}
                    >
                      📖 Log Session
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(true)}
                    sx={{ borderRadius: 2 }}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Reading Logs */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              📝 Reading Sessions
            </Typography>

            {logsLoading ? (
              <CircularProgress />
            ) : !logs?.length ? (
              <Card
                elevation={0}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
              >
                <EmptyState
                  icon="📖"
                  title="No sessions logged yet"
                  description="Start tracking your reading sessions!"
                  actionLabel="Log first session"
                  onAction={() => setIsLogging(true)}
                />
              </Card>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {logs.map((log) => {
                  const moodConfig = MOODS.find((m) => m.value === log.mood);
                  return (
                    <Card
                      key={log.id}
                      elevation={0}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        '&:hover': { borderColor: 'primary.main' },
                        transition: 'border-color 0.15s',
                      }}
                    >
                      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {log.pagesRead} pages read
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(log.date)}
                              {log.minutesSpent
                                ? ` · ${formatMinutes(log.minutesSpent)}`
                                : ''}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography fontSize={24}>
                              {moodConfig?.emoji}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Focus: {log.focusLevel}/5
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Edit Modal */}
      <Modal
        open={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Book ✏️"
        maxWidth="sm"
      >
        <BookForm
          book={book}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>

      {/* Log Session Modal */}
      <Modal
        open={isLogging}
        onClose={() => setIsLogging(false)}
        title="Log Reading Session 📖"
        maxWidth="sm"
      >
        <LogForm
          defaultBookId={book.id}
          onSuccess={() => setIsLogging(false)}
          onCancel={() => setIsLogging(false)}
        />
      </Modal>
    </Box>
  );
}