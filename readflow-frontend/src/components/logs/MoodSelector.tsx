'use client';
import { Box, Typography, Button } from '@mui/material';
import { MOODS } from '@/constants/moods';
import { Mood } from '@/types/log.types';

interface MoodSelectorProps {
  value: Mood;
  onChange: (mood: Mood) => void;
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" mb={1} display="block">
        How are you feeling? 
      </Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        {MOODS.map((mood) => (
          <Button
            key={mood.value}
            onClick={() => onChange(mood.value as Mood)}
            variant={value === mood.value ? 'contained' : 'outlined'}
            sx={{
              flex: 1,
              flexDirection: 'column',
              gap: 0.25,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1.5rem',
              lineHeight: 1,
              minWidth: 0,
              borderColor: value === mood.value ? undefined : 'divider',
              '& .label': {
                fontSize: '0.65rem',
                fontWeight: 500,
                textTransform: 'none',
              },
            }}
          >
            <span>{mood.emoji}</span>
            <span className="label">{mood.label}</span>
          </Button>
        ))}
      </Box>
    </Box>
  );
}