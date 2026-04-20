'use client';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AddIcon from '@mui/icons-material/Add';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/themeSlice';
import { openAddBookModal, openLogModal } from '@/store/slices/uiSlice';
import { profileService } from '@/services/profile.service';

export default function TopBar({ title }: { title: string }) {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((s) => s.theme.mode);

  const handleThemeToggle = async () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    dispatch(toggleTheme());
    try {
      await profileService.updateMe({ theme: newMode });
    } catch {
      // Silently fail — UI is already updated
    }
  };

  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      px: 4, py: 2,
      bgcolor: themeMode === 'dark' ? 'rgba(10,9,20,0.8)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid',
      borderColor: 'divider',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Log reading session">
          <IconButton
            onClick={() => dispatch(openLogModal(null))}
            size="small"
            sx={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(124,58,237,0.15))',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#a78bfa',
              '&:hover': { background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(124,58,237,0.3))' },
            }}
          >
            <EditNoteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add book">
          <IconButton
            onClick={() => dispatch(openAddBookModal())}
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(124,58,237,0.4)',
              '&:hover': { boxShadow: '0 6px 18px rgba(124,58,237,0.6)' },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle theme">
          <IconButton
            onClick={handleThemeToggle}
            size="small"
            sx={{ color: '#9990b8', '&:hover': { color: '#a78bfa' } }}
          >
            {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}