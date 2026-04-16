'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { Box, Typography } from '@mui/material';

interface Props {
  moodDistribution: Record<string, number>;
}

const MOOD_CONFIG = [
  { key: 'excited', label: '😄 Excited', color: '#10b981' },
  { key: 'neutral', label: '😐 Neutral', color: '#f59e0b' },
  { key: 'bored',   label: '😴 Bored',   color: '#6b7280' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{
      p: 1.5, borderRadius: 2,
      bgcolor: '#0f0e17',
      border: '1px solid rgba(124,58,237,0.25)',
    }}>
      <Typography sx={{ fontSize: 13, color: '#e8e6f0' }}>
        {label}: <strong>{payload[0].value} sessions</strong>
      </Typography>
    </Box>
  );
}

export default function MoodChart({ moodDistribution }: Props) {
  const total = Object.values(moodDistribution).reduce((s, v) => s + v, 0);

  const data = MOOD_CONFIG.map((m) => ({
    name: m.label,
    count: moodDistribution[m.key] || 0,
    color: m.color,
    pct: total > 0 ? Math.round(((moodDistribution[m.key] || 0) / total) * 100) : 0,
  }));

  return (
    <Box sx={{
      p: 3, borderRadius: 3,
      border: '1px solid rgba(124,58,237,0.15)',
      bgcolor: 'rgba(124,58,237,0.03)',
    }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>😄 Mood Distribution</Typography>
      <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2.5 }}>
        How you feel while reading
      </Typography>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.08)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#9990b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#9990b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.06)' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
        {data.map((d) => (
          <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: d.color }} />
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
              {d.name.split(' ')[1]} — <Box component="span" sx={{ color: d.color, fontWeight: 700 }}>{d.pct}%</Box>
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}