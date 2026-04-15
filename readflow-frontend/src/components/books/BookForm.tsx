"use client";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import {
  Book,
  BookStatus,
  BookDifficulty,
  CreateBookInput,
} from "@/types/book.types";
import { useCreateBook, useUpdateBook } from "@/hooks/useBooks";
import { COVER_COLORS } from "@/constants/levels";

interface BookFormProps {
  book?: Book;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const STATUS_OPTIONS: { value: BookStatus; label: string }[] = [
  { value: "to_read", label: "📌 To Read" },
  { value: "in_progress", label: "📖 In Progress" },
  { value: "completed", label: "✅ Completed" },
  { value: "dropped", label: "😅 Dropped" },
];

const DIFFICULTY_OPTIONS: { value: BookDifficulty; label: string }[] = [
  { value: "easy", label: "🟢 Easy" },
  { value: "medium", label: "🟡 Medium" },
  { value: "hard", label: "🔴 Hard" },
];

const GENRE_OPTIONS = [
  "Fiction",
  "Non-Fiction",
  "Sci-Fi",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Romance",
  "Biography",
  "History",
  "Science",
  "Self-Help",
  "Philosophy",
  "Business",
  "Technology",
  "Other",
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "rgba(124,58,237,0.05)",
  },
  "& .MuiInputBase-input": { color: "text.primary" },
  "& .MuiInputLabel-root": { color: "text.secondary" },
  "& .MuiFormHelperText-root": { color: "text.secondary" },
};

export default function BookForm({ book, onSuccess, onCancel }: BookFormProps) {
  const isEditing = !!book;
  const { mutateAsync: createBook, isPending: isCreating } = useCreateBook();
  const { mutateAsync: updateBook, isPending: isUpdating } = useUpdateBook();

  const [form, setForm] = useState<CreateBookInput>({
    title: book?.title || "",
    author: book?.author || "",
    totalPages: book?.totalPages || undefined,
    status: book?.status || "to_read",
    difficulty: book?.difficulty || undefined,
    genre: book?.genre || "",
    whyIWantToRead: book?.whyIWantToRead || "",
    expectedCompletionDate: book?.expectedCompletionDate || "",
    coverColor: book?.coverColor || COVER_COLORS[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.author.trim()) e.author = "Author is required";
    if (form.totalPages && form.totalPages < 1) e.totalPages = "Must be ≥ 1";
    setErrors(e);
    return !Object.keys(e).length;
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
    if (isEditing) await updateBook({ id: book.id, data: payload });
    else await createBook(payload);
    onSuccess?.();
  };

  const isPending = isCreating || isUpdating;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      {/* Color picker */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            display: "block",
            mb: 1,
            fontWeight: 600,
          }}
        >
          Cover Color
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {COVER_COLORS.map((color) => (
            <Tooltip key={color} title={color}>
              <Box
                onClick={() => setForm((p) => ({ ...p, coverColor: color }))}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: color,
                  cursor: "pointer",
                  border:
                    form.coverColor === color
                      ? "3px solid #fff"
                      : "2px solid transparent",
                  boxShadow:
                    form.coverColor === color
                      ? `0 0 0 2px ${color}, 0 0 12px ${color}60`
                      : `0 2px 8px ${color}60`,
                  transition: "all 0.2s",
                  "&:hover": { transform: "scale(1.15)" },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* Title & Author */}
      <TextField
        label="Book Title *"
        fullWidth
        value={form.title}
        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        error={!!errors.title}
        helperText={errors.title}
        size="small"
        sx={fieldSx}
      />
      <TextField
        label="Author *"
        fullWidth
        value={form.author}
        onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
        error={!!errors.author}
        helperText={errors.author}
        size="small"
        sx={fieldSx}
      />

      {/* Pages + Status */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <TextField
          label="Total Pages"
          type="number"
          fullWidth
          value={form.totalPages || ""}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              totalPages: e.target.value ? parseInt(e.target.value) : undefined,
            }))
          }
          error={!!errors.totalPages}
          helperText={errors.totalPages}
          size="small"
          sx={fieldSx}
          slotProps={{
            htmlInput: { min: 1 },
          }}
        />
        <TextField
          label="Status"
          select
          fullWidth
          value={form.status}
          onChange={(e) =>
            setForm((p) => ({ ...p, status: e.target.value as BookStatus }))
          }
          size="small"
          sx={fieldSx}
        >
          {STATUS_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Genre + Difficulty */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <TextField
          label="Genre"
          select
          fullWidth
          value={form.genre || ""}
          onChange={(e) => setForm((p) => ({ ...p, genre: e.target.value }))}
          size="small"
          sx={fieldSx}
        >
          <MenuItem value="">— None —</MenuItem>
          {GENRE_OPTIONS.map((g) => (
            <MenuItem key={g} value={g}>
              {g}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Difficulty"
          select
          fullWidth
          value={form.difficulty || ""}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              difficulty: (e.target.value as BookDifficulty) || undefined,
            }))
          }
          size="small"
          sx={fieldSx}
        >
          <MenuItem value="">— None —</MenuItem>
          {DIFFICULTY_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Expected Completion Date */}
      <TextField
        label="Expected Completion Date"
        type="date"
        fullWidth
        value={form.expectedCompletionDate || ""}
        onChange={(e) =>
          setForm((p) => ({ ...p, expectedCompletionDate: e.target.value }))
        }
        size="small"
        sx={fieldSx}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      {/* Why I want to read */}
      <TextField
        label="🎯 Why do you want to read this?"
        multiline
        rows={2}
        fullWidth
        value={form.whyIWantToRead || ""}
        onChange={(e) =>
          setForm((p) => ({ ...p, whyIWantToRead: e.target.value }))
        }
        size="small"
        sx={fieldSx}
        placeholder="Motivate your future self..."
      />

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", pt: 1 }}>
        <Button
          onClick={onCancel}
          disabled={isPending}
          sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          sx={{ minWidth: 130 }}
        >
          {isPending ? (
            <CircularProgress size={18} color="inherit" />
          ) : isEditing ? (
            "Update Book"
          ) : (
            "+ Add Book"
          )}
        </Button>
      </Box>
    </Box>
  );
}
