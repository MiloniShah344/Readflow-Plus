'use client';
import { Box, Typography, Skeleton } from '@mui/material';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  sublabel?: string;
  gradient: string;
  border: string;
  iconBg: string;
  valueColor: string;
  loading?: boolean;
}

export default function StatsCard({
  label, value, icon, sublabel,
  gradient, border, iconBg, valueColor, loading,
}: StatsCardProps) {
  if (loading) {
    return (
      <Skeleton
        variant="rectangular"
        height={110}
        sx={{ borderRadius: 3, bgcolor: 'rgba(124,58,237,0.08)' }}
      />
    );
  }

  return (
    <Box sx={{
      p: 2.5, borderRadius: 3,
      background: gradient,
      border: `1px solid ${border}`,
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${border}` },
    }}>
      {/* Decorative circle */}
      <Box sx={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: iconBg, opacity: 0.4,
      }} />

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 22, lineHeight: 1 }}>{icon}</Typography>
      </Box>

      <Typography sx={{ fontSize: 34, fontWeight: 900, color: valueColor, lineHeight: 1, mb: 0.25 }}>
        {value}
      </Typography>

      {sublabel && (
        <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{sublabel}</Typography>
      )}
    </Box>
  );
}