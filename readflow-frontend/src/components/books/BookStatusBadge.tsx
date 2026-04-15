'use client';
import { Chip } from '@mui/material';
import { BookStatus } from '@/types/book.types';

interface StatusConfig {
  label: string;
  color: 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info';
  icon: string;
}

const STATUS_CONFIG: Record<BookStatus, StatusConfig> = {
  to_read: { label: 'To Read', color: 'default', icon: '📌' },
  in_progress: { label: 'In Progress', color: 'primary', icon: '📖' },
  completed: { label: 'Completed', color: 'success', icon: '✅' },
  dropped: { label: 'Dropped', color: 'error', icon: '😅' },
};

interface BookStatusBadgeProps {
  status: BookStatus;
  size?: 'small' | 'medium';
}

export default function BookStatusBadge({
  status,
  size = 'small',
}: BookStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Chip
      label={`${config.icon} ${config.label}`}
      color={config.color}
      size={size}
      sx={{ fontWeight: 500, fontSize: '0.7rem' }}
    />
  );
}