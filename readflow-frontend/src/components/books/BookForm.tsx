'use client';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { Book, BookStatus, BookDifficulty, CreateBookInput } from '@/types/book.types';
import { useCreateBook, useUpdateBook } from '@/hooks/useBooks';
import { COVER_COLORS } from '@/constants/levels';

interface BookFormProps {
  book?: Book;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STATUS_OPTIONS: { value: BookStatus; label: string }[] = [
  { value: 'to_read', label: '📌 To Read' },
  { value: 'in_progress', label: '📖 In Progress' },
  { value: 'completed', label: '✅ Completed' },
  { value: 'dropped', label: '😅 Dropped' },
];

const DIFFICULTY_OPTIONS: { value: BookDifficulty; label: string }[] = [
  { value: 'easy', label: '🟢 Easy' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'hard', label: '🔴 Hard' },
];

const GENRE_OPTIONS = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
  'Thriller', 'Romance', 'Biography', 'History', 'Science',
  'Self-Help', 'Philosophy', 'Business', 'Technology', 'Other',
];

export default function BookForm({ book, onSuccess, onCancel }: BookFormProps) {
  const isEditing = !!book;
  const { mutateAsync: createBook, isPending: isCreating } = useCreateBook();
  const { mutateAsync: updateBook, isPending: isUpdating } = useUpdateBook();

  const [form, setForm] = useState<CreateBookInput>({
    title: book?.title || '',
    author: book?.author || '',
    totalPages: book?.totalPages || undefined,
    status: book?.status || 'to_read',
    difficulty: book?.difficulty || undefined,
    genre: book?.genre || '',
    whyIWantToRead: book?.whyIWantToRead || '',
    expectedCompletionDate: book?.expectedCompletionDate || '',
    coverColor: book?.coverColor || COVER_COLORS[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.author.trim()) newErrors.author = 'Author is required';
    if (form.totalPages && form.totalPages < 1)
      newErrors.totalPages = 'Must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      totalPages: form.totalPages || undefined,
      genre: form.genre || undefined,
      whyIWantToRead: form.whyIWantToRead || undefined,
      expectedCompletionDate: form.expectedCompletionDate || undefined,
      difficulty: form.difficulty || undefined,
    };

    if (isEditing) {
      await updateBook({ id: book.id, data: payload });
    } else {
      await createBook(payload);
    }
    onSuccess?.();
  };

  const isPending = isCreating || isUpdating;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Color picker */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" mb={1} display="block">
            Cover Color
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {COVER_COLORS.map((color) => (
              <Box
                key={color}
                onClick={() => setForm((p) => ({ ...p, coverColor: color }))}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: color,
                  cursor: 'pointer',
                  border: form.coverColor === color ? '3px solid white' : '2px solid transparent',
                  boxShadow: form.coverColor === color ? `0 0 0 2px ${color}` : 'none',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Book Title *"
            fullWidth
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            error={!!errors.title}
            helperText={errors.title}
            size="small"
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Author *"
            fullWidth
            value={form.author}
            onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
            error={!!errors.author}
            helperText={errors.author}
            size="small"
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Total Pages"
            type="number"
            fullWidth
            value={form.totalPages || ''}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                totalPages: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
            error={!!errors.totalPages}
            helperText={errors.totalPages}
            size="small"
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Status"
            select
            fullWidth
            value={form.status}
            onChange={(e) =>
              setForm((p) => ({ ...p, status: e.target.value as BookStatus }))
            }
            size="small"
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Genre"
            select
            fullWidth
            value={form.genre || ''}
            onChange={(e) => setForm((p) => ({ ...p, genre: e.target.value }))}
            size="small"
          >
            <MenuItem value="">— None —</MenuItem>
            {GENRE_OPTIONS.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Difficulty"
            select
            fullWidth
            value={form.difficulty || ''}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                difficulty: e.target.value as BookDifficulty || undefined,
              }))
            }
            size="small"
          >
            <MenuItem value="">— None —</MenuItem>
            {DIFFICULTY_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Expected Completion Date"
            placeholder=''
            type="date"
            fullWidth
            value={form.expectedCompletionDate || ''}
            onChange={(e) =>
              setForm((p) => ({ ...p, expectedCompletionDate: e.target.value }))
            }
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Why do you want to read this? 🎯"
            multiline
            rows={3}
            fullWidth
            value={form.whyIWantToRead || ''}
            onChange={(e) =>
              setForm((p) => ({ ...p, whyIWantToRead: e.target.value }))
            }
            size="small"
            placeholder="Motivate yourself..."
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={onCancel} color="inherit" disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              sx={{ borderRadius: 2, minWidth: 120 }}
            >
              {isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : isEditing ? (
                'Update Book'
              ) : (
                'Add Book'
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}