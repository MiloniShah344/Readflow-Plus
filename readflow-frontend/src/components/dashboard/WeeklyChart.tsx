'use client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';
import { Box, Typography } from '@mui/material';

interface Props {
  pagesByDayOfWeek: number[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#0f0e17', border: '1px solid rgba(124,58,237,0.25)' }}>
      <Typography sx={{ fontSize: 13, color: '#e8e6f0' }}>
        {label}: <strong>{payload[0].value} pages</strong>
      </Typography>
    </Box>
  );
}

export default function WeeklyChart({ pagesByDayOfWeek }: Props) {
  const today = new Date().getDay();
  const maxPages = Math.max(...pagesByDayOfWeek, 1);

  const data = DAYS.map((day, i) => ({
    day,
    pages: pagesByDayOfWeek[i] || 0,
    isToday: i === today,
    ratio: (pagesByDayOfWeek[i] || 0) / maxPages,
  }));

  return (
    <Box sx={{
      p: 3, borderRadius: 3,
      border: '1px solid rgba(124,58,237,0.15)',
      bgcolor: 'rgba(124,58,237,0.03)',
    }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>📊 Pages by Day</Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2.5 }}>
        Your weekly reading pattern
      </Typography>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#9990b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#9990b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.06)' }} />
          <Bar dataKey="pages" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isToday ? '#f59e0b' : entry.ratio > 0.6 ? '#7c3aed' : 'rgba(124,58,237,0.4)'}
                fillOpacity={entry.pages === 0 ? 0.2 : 0.9}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}