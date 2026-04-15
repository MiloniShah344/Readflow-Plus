'use client';
import { Box, Typography, Button } from '@mui/material';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = '📚', title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, px: 3, textAlign: 'center' }}>
      <Box sx={{ fontSize: 64, lineHeight: 1, mb: 2, filter: 'drop-shadow(0 4px 12px rgba(124,58,237,0.3))' }}>
        {icon}
      </Box>
      <Typography variant="h6" component="div" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 280 }}>{description}</Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ borderRadius: 2 }}>{actionLabel}</Button>
      )}
    </Box>
  );
}