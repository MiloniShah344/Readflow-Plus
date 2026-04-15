'use client';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Slider,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { CreateLogInput, Mood } from '@/types/log.types';
import { useCreateLog } from '@/hooks/useLogs';
import { useBooks } from '@/hooks/useBooks';
import MoodSelector from './MoodSelector';

interface LogFormProps {
  defaultBookId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FOCUS_LABELS: Record<number, string> = {
  1: '😵 Very Distracted',
  2: '😕 Unfocused',
  3: '😐 Average',
  4: '🎯 Focused',
  5: '🔥 Deep Focus',
};

export default function LogForm({
  defaultBookId,
  onSuccess,
  onCancel,
}: LogFormProps) {
  const { mutateAsync: createLog, isPending } = useCreateLog();
  const { data: books } = useBooks();

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<CreateLogInput>({
    bookId: defaultBookId || '',
    pagesRead: 0,
    minutesSpent: undefined,
    mood: 'neutral',
    focusLevel: 3,
    date: today,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.bookId) newErrors.bookId = 'Please select a book';
    if (!form.pagesRead || form.pagesRead < 1)
      newErrors.pagesRead = 'Enter at least 1 page';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await createLog(form);
    onSuccess?.();
  };

  const inProgressBooks = books?.filter(
    (b) => b.status === 'in_progress' || b.status === 'to_read',
  );

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <TextField
            label="Book *"
            select
            fullWidth
            value={form.bookId}
            onChange={(e) => setForm((p) => ({ ...p, bookId: e.target.value }))}
            error={!!errors.bookId}
            helperText={errors.bookId}
            size="small"
            disabled={!!defaultBookId}
          >
            {!inProgressBooks?.length && (
              <MenuItem value="" disabled>
                No books in progress — add one first!
              </MenuItem>
            )}
            {inProgressBooks?.map((book) => (
              <MenuItem key={book.id} value={book.id}>
                {book.title} — {book.author}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Pages Read *"
            type="number"
            fullWidth
            value={form.pagesRead || ''}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                pagesRead: e.target.value ? parseInt(e.target.value) : 0,
              }))
            }
            error={!!errors.pagesRead}
            helperText={errors.pagesRead}
            size="small"
            inputProps={{ min: 1 }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Time Spent (minutes)"
            type="number"
            fullWidth
            value={form.minutesSpent || ''}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                minutesSpent: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
            size="small"
            inputProps={{ min: 1 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            size="small"
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: today }}
          />
        </Grid>

        <Grid item xs={12}>
          <MoodSelector
            value={form.mood as Mood}
            onChange={(mood) => setForm((p) => ({ ...p, mood }))}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
            Focus Level: {FOCUS_LABELS[form.focusLevel || 3]}
          </Typography>
          <Slider
            value={form.focusLevel || 3}
            min={1}
            max={5}
            step={1}
            marks={[1, 2, 3, 4, 5].map((v) => ({ value: v, label: String(v) }))}
            onChange={(_, value) =>
              setForm((p) => ({ ...p, focusLevel: value as number }))
            }
            sx={{ mt: 1 }}
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
              sx={{ borderRadius: 2, minWidth: 140 }}
            >
              {isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                '📖 Log Session'
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}