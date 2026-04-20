'use client';
import {
  Box, Typography, Button, Chip, CircularProgress,
  TextField, Switch, FormControlLabel, IconButton, Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
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
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@/hooks/useNotes';
import { getProgressPercent, formatDate, formatMinutes } from '@/utils/formatters';
import { MOODS } from '@/constants/moods';
import { COVER_COLORS } from '@/constants/levels';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isHighlight, setIsHighlight] = useState(false);
  const [activeTab, setActiveTab] = useState<'sessions' | 'notes'>('sessions');

  const { data: book, isLoading: bookLoading } = useBook(id);
  const { data: logs, isLoading: logsLoading } = useLogs({ bookId: id });
  const { data: notes, isLoading: notesLoading } = useNotes(id);
  const { mutate: createNote, isPending: creatingNote } = useCreateNote();
  const { mutate: updateNote } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();

  if (bookLoading) return (
    <Box><TopBar title="Book Detail" />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400 }}>
        <CircularProgress sx={{ color: '#7c3aed' }} />
      </Box>
    </Box>
  );

  if (!book) return (
    <Box><TopBar title="Not Found" />
      <EmptyState icon="🔍" title="Book not found" description="Deleted or doesn't exist."
        actionLabel="Back to Library" onAction={() => router.push('/dashboard/books')} />
    </Box>
  );

  const progress = getProgressPercent(book.currentPage, book.totalPages);
  const coverColor = book.coverColor || COVER_COLORS[book.title.charCodeAt(0) % COVER_COLORS.length];
  const totalPagesRead = logs?.reduce((s, l) => s + l.pagesRead, 0) || 0;
  const totalMins = logs?.reduce((s, l) => s + (l.minutesSpent || 0), 0) || 0;

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    createNote({ bookId: id, content: noteContent.trim(), isHighlight }, {
      onSuccess: () => { setNoteContent(''); setIsHighlight(false); },
    });
  };

  const tabStyle = (active: boolean) => ({
    px: 2.5, py: 1, borderRadius: 2, cursor: 'pointer', fontSize: 13, fontWeight: active ? 700 : 400,
    bgcolor: active ? 'rgba(124,58,237,0.15)' : 'transparent',
    border: active ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
    color: active ? '#a78bfa' : 'text.secondary',
    transition: 'all 0.15s',
    '&:hover': { bgcolor: 'rgba(124,58,237,0.08)' },
  });

  return (
    <Box>
      <TopBar title="Book Detail" />
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 1200 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/dashboard/books')}
          sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
          Back to Library
        </Button>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 3 }}>
          {/* Left panel */}
          <Box>
            <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(124,58,237,0.15)', bgcolor: 'rgba(124,58,237,0.02)' }}>
              <Box sx={{ height: 180, background: `linear-gradient(135deg, ${coverColor}99, ${coverColor}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: 72, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' }}>📖</Typography>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ mb: 1.5 }}><BookStatusBadge status={book.status} /></Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, lineHeight: 1.2 }}>{book.title}</Typography>
                <Typography sx={{ color: 'text.secondary', mb: 2, fontSize: 15 }}>by {book.author}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {book.genre && <Chip label={book.genre} size="small" sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: 'none' }} />}
                  {book.difficulty && <Chip label={book.difficulty} size="small" variant="outlined" sx={{ borderColor: 'rgba(124,58,237,0.3)', color: 'text.secondary', textTransform: 'capitalize' }} />}
                </Box>
                {book.totalPages && <Box sx={{ mb: 2 }}><ProgressBar value={progress} label={`${book.currentPage} / ${book.totalPages} pages`} height={8} color={book.status === 'completed' ? 'success' : 'primary'} /></Box>}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                  {[
                    { label: 'Sessions', value: logs?.length || 0, color: '#a78bfa' },
                    { label: 'Pages Read', value: totalPagesRead, color: '#10b981' },
                    ...(totalMins > 0 ? [{ label: 'Time', value: formatMinutes(totalMins), color: '#f59e0b' }] : []),
                    { label: 'Notes', value: notes?.length || 0, color: '#60a5fa' },
                  ].map((s) => (
                    <Box key={s.label} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.1)' }}>
                      <Typography sx={{ fontSize: 10, color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.25 }}>{s.label}</Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                    </Box>
                  ))}
                </Box>
                {book.whyIWantToRead && (
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', mb: 2 }}>
                    <Typography sx={{ fontSize: 10, color: '#f59e0b', fontWeight: 800, mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>🎯 Why I want to read</Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary', fontStyle: 'italic' }}>{book.whyIWantToRead}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {(book.status === 'in_progress' || book.status === 'to_read') && (
                    <Button variant="contained" fullWidth onClick={() => setIsLogging(true)} sx={{ borderRadius: 2 }}>
                      📖 Log Session
                    </Button>
                  )}
                  <Button variant="outlined" onClick={() => setIsEditing(true)}
                    sx={{ borderRadius: 2, minWidth: 44, px: 1.5, borderColor: 'rgba(124,58,237,0.3)', color: '#a78bfa', '&:hover': { borderColor: '#7c3aed', bgcolor: 'rgba(124,58,237,0.1)' } }}>
                    <EditIcon sx={{ fontSize: 18 }} />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right panel */}
          <Box>
            {/* Tabs */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Box sx={tabStyle(activeTab === 'sessions')} onClick={() => setActiveTab('sessions')}>
                📝 Sessions ({logs?.length || 0})
              </Box>
              <Box sx={tabStyle(activeTab === 'notes')} onClick={() => setActiveTab('notes')}>
                💡 Notes ({notes?.length || 0})
              </Box>
            </Box>

            {/* Sessions tab */}
            {activeTab === 'sessions' && (
              logsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>
              ) : !logs?.length ? (
                <Box sx={{ borderRadius: 3, border: '1px solid rgba(124,58,237,0.15)', bgcolor: 'rgba(124,58,237,0.02)' }}>
                  <EmptyState icon="📖" title="No sessions logged" description="Start tracking your reading progress!"
                    actionLabel="Log first session" onAction={() => setIsLogging(true)} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {logs.map((log) => {
                    const mood = MOODS.find((m) => m.value === log.mood);
                    return (
                      <Box key={log.id} sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(124,58,237,0.12)', bgcolor: 'rgba(124,58,237,0.02)', '&:hover': { borderColor: 'rgba(124,58,237,0.3)', bgcolor: 'rgba(124,58,237,0.06)' }, transition: 'all 0.15s' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 0.25 }}>{log.pagesRead} pages</Typography>
                            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                              {formatDate(log.date)}{log.minutesSpent ? ` · ${formatMinutes(log.minutesSpent)}` : ''}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography sx={{ fontSize: 28, lineHeight: 1, mb: 0.5 }}>{mood?.emoji}</Typography>
                            <Box sx={{ px: 1, py: 0.25, borderRadius: 10, bgcolor: 'rgba(124,58,237,0.12)' }}>
                              <Typography sx={{ fontSize: 10, color: '#a78bfa', fontWeight: 700 }}>Focus {log.focusLevel}/5</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )
            )}

            {/* Notes tab */}
            {activeTab === 'notes' && (
              <Box>
                {/* Add note */}
                <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(124,58,237,0.2)', bgcolor: 'rgba(124,58,237,0.04)', mb: 3 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
                    ✍️ Add a Note
                  </Typography>
                  <TextField
                    multiline rows={3} fullWidth
                    placeholder="Write your thoughts, quotes, or key takeaways..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    size="small"
                    sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(124,58,237,0.03)' } }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isHighlight}
                          onChange={(e) => setIsHighlight(e.target.checked)}
                          size="small"
                          sx={{ '& .MuiSwitch-thumb': { bgcolor: isHighlight ? '#f59e0b' : undefined }, '& .Mui-checked .MuiSwitch-thumb': { bgcolor: '#f59e0b' }, '& .MuiSwitch-track': { bgcolor: isHighlight ? 'rgba(245,158,11,0.3)' : undefined } }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: 13, color: isHighlight ? '#f59e0b' : 'text.secondary', fontWeight: isHighlight ? 600 : 400 }}>
                          ⭐ Mark as highlight
                        </Typography>
                      }
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddNote}
                      disabled={!noteContent.trim() || creatingNote}
                      sx={{ borderRadius: 2, minWidth: 100 }}
                      size="small"
                    >
                      {creatingNote ? <CircularProgress size={16} color="inherit" /> : 'Save Note'}
                    </Button>
                  </Box>
                </Box>

                {/* Notes list */}
                {notesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>
                ) : !notes?.length ? (
                  <Box sx={{ borderRadius: 3, border: '1px solid rgba(124,58,237,0.12)', bgcolor: 'rgba(124,58,237,0.02)' }}>
                    <EmptyState icon="💡" title="No notes yet" description="Add your first note or highlight from this book!" />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {notes.map((note) => (
                      <Box key={note.id} sx={{
                        p: 2.5, borderRadius: 3,
                        border: note.isHighlight ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(124,58,237,0.12)',
                        bgcolor: note.isHighlight ? 'rgba(245,158,11,0.05)' : 'rgba(124,58,237,0.02)',
                        position: 'relative',
                        transition: 'all 0.15s',
                        '&:hover': { borderColor: note.isHighlight ? 'rgba(245,158,11,0.5)' : 'rgba(124,58,237,0.3)' },
                      }}>
                        {note.isHighlight && (
                          <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 0.5 }}>
                            <Typography sx={{ fontSize: 14 }}>⭐</Typography>
                          </Box>
                        )}
                        <Typography sx={{ fontSize: 14, color: 'text.primary', lineHeight: 1.6, mb: 1.5, pr: note.isHighlight ? 3 : 0 }}>
                          {note.content}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
                            {formatDate(note.createdAt)}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title={note.isHighlight ? 'Remove highlight' : 'Mark as highlight'}>
                              <IconButton
                                size="small"
                                onClick={() => updateNote({ id: note.id, bookId: id, data: { isHighlight: !note.isHighlight } })}
                                sx={{ color: note.isHighlight ? '#f59e0b' : '#6b6486', '&:hover': { color: '#f59e0b' } }}
                              >
                                {note.isHighlight ? <StarIcon sx={{ fontSize: 16 }} /> : <StarBorderIcon sx={{ fontSize: 16 }} />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete note">
                              <IconButton
                                size="small"
                                onClick={() => { if (confirm('Delete this note?')) deleteNote({ id: note.id, bookId: id }); }}
                                sx={{ color: '#6b6486', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' } }}
                              >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Modal open={isEditing} onClose={() => setIsEditing(false)} title="✏️ Edit Book" maxWidth="sm">
        <BookForm book={book} onSuccess={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
      </Modal>
      <Modal open={isLogging} onClose={() => setIsLogging(false)} title="📖 Log Session" maxWidth="sm">
        <LogForm defaultBookId={book.id} onSuccess={() => setIsLogging(false)} onCancel={() => setIsLogging(false)} />
      </Modal>
    </Box>
  );
}