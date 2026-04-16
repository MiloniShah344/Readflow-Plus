/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { HeatmapDay } from '@/types/analytics.types';

const CalendarHeatmap = dynamic(
  () => import('react-calendar-heatmap'),
  { ssr: false },
);

interface Props {
  data: HeatmapDay[];
}

export default function ReadingHeatmap({ data }: Props) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  function classForValue(value: { date: string; count: number } | null) {
    if (!value || value.count === 0) return 'heatmap-empty';
    const ratio = value.count / maxCount;
    if (ratio < 0.25) return 'heatmap-1';
    if (ratio < 0.5)  return 'heatmap-2';
    if (ratio < 0.75) return 'heatmap-3';
    return 'heatmap-4';
  }

  function tooltipAttrs(value: { date: string; count: number } | null) {
    if (!value || !value.date) return { 'data-tip': '' };
    return { 'data-tip': `${value.date}: ${value.count} pages` };
  }

  return (
    <Box sx={{
      p: 3, borderRadius: 3,
      border: '1px solid rgba(124,58,237,0.15)',
      bgcolor: 'rgba(124,58,237,0.03)',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>📅 Reading Activity</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>Less</Typography>
          {['rgba(124,58,237,0.1)', 'rgba(124,58,237,0.3)', 'rgba(124,58,237,0.55)', 'rgba(124,58,237,0.8)'].map((c, i) => (
            <Box key={i} sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: c }} />
          ))}
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>More</Typography>
        </Box>
      </Box>

      <Box sx={{
        overflow: 'hidden',
        '& .react-calendar-heatmap': { width: '100%' },
        '& .react-calendar-heatmap text': { fill: '#6b6486', fontSize: '9px', fontFamily: 'inherit' },
        '& .react-calendar-heatmap rect': { rx: 2 },
        '& .heatmap-empty': { fill: 'rgba(124,58,237,0.06)' },
        '& .heatmap-1': { fill: 'rgba(124,58,237,0.22)' },
        '& .heatmap-2': { fill: 'rgba(124,58,237,0.45)' },
        '& .heatmap-3': { fill: 'rgba(124,58,237,0.65)' },
        '& .heatmap-4': { fill: 'rgba(124,58,237,0.9)' },
      }}>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={data}
          classForValue={classForValue as any}
          tooltipDataAttrs={tooltipAttrs as any}
          showWeekdayLabels
          gutterSize={2}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          📚 <Box component="span" sx={{ color: '#a78bfa', fontWeight: 700 }}>{data.reduce((s, d) => s + d.count, 0)}</Box> total pages this year
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
          📅 <Box component="span" sx={{ color: '#a78bfa', fontWeight: 700 }}>{data.filter((d) => d.count > 0).length}</Box> active days
        </Typography>
      </Box>
    </Box>
  );
}