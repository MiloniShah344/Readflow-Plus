'use client';
import { Box, LinearProgress, Typography } from '@mui/material';

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercent?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'info';
  height?: number;
}

export default function ProgressBar({ value, label, showPercent = true, color = 'primary', height = 8 }: ProgressBarProps) {
  return (
    <Box>
      {(label || showPercent) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          {label && <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>{label}</Typography>}
          {showPercent && <Typography variant="caption" sx={{ color: '#a78bfa', fontWeight: 700, fontSize: 11 }}>{value}%</Typography>}
        </Box>
      )}
      <LinearProgress
        variant="determinate"
        value={value}
        color={color}
        sx={{
          height,
          borderRadius: height / 2,
          bgcolor: 'rgba(124,58,237,0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: height / 2,
            background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
          },
        }}
      />
    </Box>
  );
}