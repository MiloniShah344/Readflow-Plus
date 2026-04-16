"use client";
import {
  Box,
  TextField,
  Button,
  Typography,
  Slider,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { CreateLogInput, Mood } from "@/types/log.types";
import { useCreateLog } from "@/hooks/useLogs";
import { useBooks } from "@/hooks/useBooks";
import MoodSelector from "./MoodSelector";

const FOCUS: Record<number, string> = {
  1: "😵 Very Distracted",
  2: "😕 Unfocused",
  3: "😐 Average",
  4: "🎯 Focused",
  5: "🔥 Deep Focus",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "rgba(124,58,237,0.05)",
  },
  "& .MuiInputBase-input": { color: "text.primary" },
  "& .MuiInputLabel-root": { color: "text.secondary" },
  "& .MuiFormHelperText-root": { color: "text.secondary" },
};

export default function LogForm({
  defaultBookId,
  onSuccess,
  onCancel,
}: {
  defaultBookId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const { mutateAsync: createLog, isPending } = useCreateLog();
  const { data: books } = useBooks();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState<CreateLogInput>({
    bookId: defaultBookId || "",
    pagesRead: 0,
    minutesSpent: undefined,
    mood: "neutral",
    focusLevel: 3,
    date: today,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.bookId) e.bookId = "Please select a book";
    if (remainingPages !== undefined && form.pagesRead > remainingPages) {
      e.pagesRead = `Only ${remainingPages} pages remaining`;
    }
    if (!form.pagesRead || form.pagesRead < 1)
      e.pagesRead = "Enter at least 1 page";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const selectedBook = books?.find((b) => b.id === form.bookId);
  const remainingPages = selectedBook
    ? (selectedBook.totalPages || 0) - (selectedBook.currentPage || 0)
    : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await createLog(form);
    onSuccess?.();
  };

  const eligibleBooks = books?.filter(
    (b) => b.status === "in_progress" || b.status === "to_read",
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      {/* Book selector */}
      <TextField
        label="Select Book *"
        select
        fullWidth
        value={form.bookId}
        onChange={(e) => setForm((p) => ({ ...p, bookId: e.target.value }))}
        error={!!errors.bookId}
        helperText={errors.bookId}
        size="small"
        disabled={!!defaultBookId}
        sx={fieldSx}
      >
        {!eligibleBooks?.length ? (
          <MenuItem value="" disabled>
            No books in progress — add one first!
          </MenuItem>
        ) : (
          eligibleBooks.map((b) => (
            <MenuItem key={b.id} value={b.id}>
              {b.title} — {b.author}
            </MenuItem>
          ))
        )}
      </TextField>

      {/* Pages + Time */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <TextField
          label="Pages Read *"
          type="number"
          fullWidth
          value={form.pagesRead || ""}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              pagesRead: e.target.value ? parseInt(e.target.value) : 0,
            }))
          }
          error={!!errors.pagesRead}
          helperText={
            errors.pagesRead ||
            (remainingPages !== undefined ? `${remainingPages} pages left` : "")
          }
          size="small"
          sx={fieldSx}
          slotProps={{
            htmlInput: { min: 1, max: remainingPages || undefined },
          }}
        />
        <TextField
          label="Time (minutes)"
          type="number"
          fullWidth
          value={form.minutesSpent || ""}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              minutesSpent: e.target.value
                ? parseInt(e.target.value)
                : undefined,
            }))
          }
          size="small"
          sx={fieldSx}
          slotProps={{
            htmlInput: { min: 1 },
          }}
        />
      </Box>

      {/* Date */}
      <TextField
        label="Date"
        type="date"
        fullWidth
        value={form.date}
        onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
        size="small"
        sx={fieldSx}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { max: today },
        }}
      />

      {/* Mood */}
      <MoodSelector
        value={form.mood as Mood}
        onChange={(mood) => setForm((p) => ({ ...p, mood }))}
      />

      {/* Focus level */}
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
          Focus Level:{" "}
          <Box component="span" sx={{ color: "#a78bfa" }}>
            {FOCUS[form.focusLevel || 3]}
          </Box>
        </Typography>
        <Slider
          value={form.focusLevel || 3}
          min={1}
          max={5}
          step={1}
          marks={[1, 2, 3, 4, 5].map((v) => ({ value: v, label: String(v) }))}
          onChange={(_, v) =>
            setForm((p) => ({ ...p, focusLevel: v as number }))
          }
          sx={{
            color: "#7c3aed",
            "& .MuiSlider-markLabel": { color: "text.secondary", fontSize: 11 },
          }}
        />
      </Box>

      <Box
        sx={{ display: "flex", gap: 2, justifyContent: "flex-end", pt: 0.5 }}
      >
        <Button
          onClick={onCancel}
          disabled={isPending}
          sx={{ color: "text.secondary" }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          sx={{ minWidth: 140 }}
        >
          {isPending ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "📖 Log Session"
          )}
        </Button>
      </Box>
    </Box>
  );
}
