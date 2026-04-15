'use client';
import { Box, LinearProgress, Typography } from '@mui/material';

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercent?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'info';
  height?: number;
}

export default function ProgressBar({
  value,
  label,
  showPercent = true,
  color = 'primary',
  height = 8,
}: ProgressBarProps) {
  return (
    <Box>
      {(label || showPercent) && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={0.5}
        >
          {label && (
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
          )}
          {showPercent && (
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {value}%
            </Typography>
          )}
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={value}
        color={color}
        sx={{
          height,
          borderRadius: height / 2,
          backgroundColor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            borderRadius: height / 2,
          },
        }}
      />
    </Box>
  );
}