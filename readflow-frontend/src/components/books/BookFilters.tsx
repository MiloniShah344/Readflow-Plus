'use client';
import { Box, TextField, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface BookFiltersProps {
  status: string;
  onStatusChange: (status: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Books' },
  { value: 'to_read', label: '📌 To Read' },
  { value: 'in_progress', label: '📖 In Progress' },
  { value: 'completed', label: '✅ Completed' },
  { value: 'dropped', label: '😅 Dropped' },
];

export default function BookFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
}: BookFiltersProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <TextField
        placeholder="Search books..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{ minWidth: 220 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        size="small"
        sx={{ minWidth: 160 }}
        label="Filter by status"
      >
        {STATUS_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}