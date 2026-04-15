'use client';
import { Box, Typography } from '@mui/material';
import { MOODS } from '@/constants/moods';
import { Mood } from '@/types/log.types';

export default function MoodSelector({ value, onChange }: { value: Mood; onChange: (m: Mood) => void }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, fontWeight: 600 }}>
        How are you feeling while reading?
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {MOODS.map((mood) => {
          const active = value === mood.value;
          return (
            <Box
              key={mood.value}
              onClick={() => onChange(mood.value as Mood)}
              sx={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 0.5, py: 1.5, borderRadius: 2, cursor: 'pointer',
                border: active ? `2px solid ${mood.color}` : '2px solid rgba(124,58,237,0.15)',
                bgcolor: active ? `${mood.color}20` : 'rgba(124,58,237,0.04)',
                transition: 'all 0.2s',
                '&:hover': { borderColor: mood.color, transform: 'scale(1.04)' },
              }}
            >
              <Typography sx={{ fontSize: 28, lineHeight: 1 }}>{mood.emoji}</Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: active ? mood.color : 'text.secondary' }}>
                {mood.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}