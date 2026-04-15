'use client';
import { Box, TextField, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface BookFiltersProps {
  status: string;
  onStatusChange: (status: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(124,58,237,0.05)' },
  '& .MuiInputBase-input': { color: 'text.primary' },
  '& .MuiInputLabel-root': { color: 'text.secondary' },
};

export default function BookFilters({ status, onStatusChange, search, onSearchChange }: BookFiltersProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        placeholder="Search books..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small" sx={{ minWidth: 200, ...fieldSx }}
        slotProps={{
          input: {startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#9990b8' }} /></InputAdornment>,}
        }}
      />
      <TextField
        select value={status} label="Filter"
        onChange={(e) => onStatusChange(e.target.value)}
        size="small" sx={{ minWidth: 150, ...fieldSx }}
      >
        {[
          { value: '', label: 'All Books' },
          { value: 'to_read', label: '📌 To Read' },
          { value: 'in_progress', label: '📖 In Progress' },
          { value: 'completed', label: '✅ Completed' },
          { value: 'dropped', label: '😅 Dropped' },
        ].map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
      </TextField>
    </Box>
  );
}