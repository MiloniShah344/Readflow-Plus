'use client';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  IconButton,
  Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { getLevelInfo } from '@/utils/formatters';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: <DashboardIcon /> },
  { label: 'My Books', href: '/books', icon: <LibraryBooksIcon /> },
  { label: 'Reading Logs', href: '/logs', icon: <HistoryIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const levelInfo = getLevelInfo(user?.xp || 0);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <Box
      sx={{
        width: 260,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}
        >
          📚 ReadFlow+
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Your reading companion
        </Typography>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ px: 1, py: 1, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.href)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.dark' : 'action.hover',
                  },
                  transition: 'all 0.15s',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.contrastText' : 'text.secondary',
                    minWidth: 38,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* User profile */}
      <Box sx={{ px: 2, py: 2 }}>
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'action.hover',
            mb: 1,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
              fontWeight: 700,
            }}
          >
            {user?.email?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              fontWeight={600}
              display="block"
              noWrap
            >
              {user?.email}
            </Typography>
            <Chip
              label={`Lv.${user?.level} ${levelInfo.name}`}
              size="small"
              color="primary"
              sx={{ fontSize: '0.6rem', height: 18, mt: 0.25 }}
            />
          </Box>
        </Box>

        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 2, color: 'error.main', py: 0.75 }}
        >
          <ListItemIcon sx={{ color: 'error.main', minWidth: 36 }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: '0.85rem' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}