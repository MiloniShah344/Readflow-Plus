'use client';
import { Box, Typography } from '@mui/material';
import { BookStatus } from '@/types/book.types';

// const STATUS: Record<BookStatus, { label: string; icon: string; bg: string; color: string }> = {
//   to_read:     { label: 'To Read',     icon: '📌', bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
//   in_progress: { label: 'In Progress', icon: '📖', bg: 'rgba(124,58,237,0.2)',   color: '#a78bfa' },
//   completed:   { label: 'Completed',   icon: '✅', bg: 'rgba(16,185,129,0.15)',  color: '#10b981' },
//   dropped:     { label: 'Dropped',     icon: '😅', bg: 'rgba(239,68,68,0.15)',   color: '#ef4444' },
// };

const STATUS: Record<BookStatus, { label: string; icon: string; bg: string; color: string }> = {
  to_read:     { label: 'To Read',     icon: '📌', bg: 'background.primary', color: 'text.primary' },
  in_progress: { label: 'In Progress', icon: '📖', bg: 'background.primary',   color: 'text.primary' },
  completed:   { label: 'Completed',   icon: '✅', bg: 'background.primary',  color: 'text.primary' },
  dropped:     { label: 'Dropped',     icon: '😅', bg: 'background.primary',   color: 'text.primary' },
};


export default function BookStatusBadge({ status, size = 'small' }: { status: BookStatus; size?: 'small' | 'medium' }) {
  const s = STATUS[status];
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      px: size === 'small' ? 1 : 1.5,
      py: size === 'small' ? 0.25 : 0.5,
      borderRadius: 10,
      bgcolor: s.bg,
      border: `1px solid ${s.color}40`,
    }}>
      <Typography sx={{ fontSize: size === 'small' ? 10 : 12 }}>{s.icon}</Typography>
      <Typography sx={{ fontSize: size === 'small' ? 11 : 13, fontWeight: 600, color: s.color }}>
        {s.label}
      </Typography>
    </Box>
  );
}