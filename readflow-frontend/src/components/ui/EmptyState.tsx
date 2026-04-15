'use client';
import { Box, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = '📚',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Typography fontSize={64} lineHeight={1} mb={2}>
        {icon}
      </Typography>
      <Typography variant="h6" fontWeight={600} mb={1}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        mb={3}
        maxWidth={320}
      >
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ borderRadius: 2 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}