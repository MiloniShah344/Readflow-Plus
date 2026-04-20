'use client';
import { Box, Typography } from '@mui/material';
import { Insight } from '@/types/analytics.types';

const TYPE_STYLES: Record<string, { bg: string; border: string; glow: string }> = {
  weekend:     { bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.25)', glow: 'rgba(124,58,237,0.15)' },
  weekday:     { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)',  glow: 'rgba(59,130,246,0.15)' },
  consistent:  { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', glow: 'rgba(16,185,129,0.15)' },
  focus:       { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', glow: 'rgba(245,158,11,0.15)' },
  best_day:    { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  glow: 'rgba(239,68,68,0.15)' },
  consistency: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', glow: 'rgba(16,185,129,0.15)' },
  speed:       { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', glow: 'rgba(245,158,11,0.15)' },
  mood:        { bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.25)', glow: 'rgba(236,72,153,0.15)' },
  start:       { bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.15)', glow: 'transparent' },
};

export default function InsightCard({ insight }: { insight: Insight }) {
  const style = TYPE_STYLES[insight.type] || TYPE_STYLES.start;

  return (
    <Box sx={{
      p: 2.5, borderRadius: 3,
      background: style.bg,
      border: `1px solid ${style.border}`,
      position: 'relative', overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 24px ${style.glow}`,
      },
    }}>
      {/* Decorative background */}
      <Box sx={{
        position: 'absolute', top: -16, right: -16,
        width: 64, height: 64, borderRadius: '50%',
        background: `radial-gradient(circle, ${style.border}, transparent)`,
        opacity: 0.5,
      }} />

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, position: 'relative' }}>
        <Box sx={{
          width: 42, height: 42, borderRadius: 2, flexShrink: 0,
          bgcolor: style.border,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          {insight.icon}
        </Box>
        <Typography sx={{ fontSize: 14, color: 'text.primary', lineHeight: 1.5, fontWeight: 500, pt: 0.5 }}>
          {insight.message}
        </Typography>
      </Box>
    </Box>
  );
}