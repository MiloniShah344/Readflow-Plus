'use client';
import { ReactNode, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';

function ThemeWrapper({ children }: { children: ReactNode }) {
  const themeMode = useAppSelector((s) => s.theme.mode);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('rf_token');
    const userStr = localStorage.getItem('rf_user');
    if (token && userStr) {
      try { dispatch(initializeAuth({ token, user: JSON.parse(userStr) })); } catch {}
    }
  }, [dispatch]);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: { main: '#7c3aed', dark: '#6d28d9', light: '#a78bfa' },
      secondary: { main: '#f59e0b' },
      error: { main: '#ef4444' },
      success: { main: '#10b981' },
      background: {
        default: themeMode === 'dark' ? '#07070d' : '#f1f0f7',
        paper:   themeMode === 'dark' ? '#1f1d2e' : '#ffffff',
      },
      text: {
        primary:   themeMode === 'dark' ? '#e8e6f0' : '#1a1625',
        secondary: themeMode === 'dark' ? '#9990b8' : '#6b6486',
      },
      divider: themeMode === 'dark' ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.12)',
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 10 },
          contained: {
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            boxShadow: '0 4px 15px rgba(124,58,237,0.35)',
            '&:hover': { boxShadow: '0 6px 20px rgba(124,58,237,0.5)' },
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              '& fieldset': { borderColor: themeMode === 'dark' ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.2)' },
              '&:hover fieldset': { borderColor: 'rgba(124,58,237,0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: themeMode === 'dark' ? '1px solid rgba(124,58,237,0.15)' : '1px solid rgba(124,58,237,0.1)',
            borderRadius: 16,
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            border: themeMode === 'dark' ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(124,58,237,0.1)',
            background: themeMode === 'dark' ? '#0f0e17' : '#ffffff',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: 12,
            background: themeMode === 'dark' ? '#1a1730' : '#fff',
            color: themeMode === 'dark' ? '#e8e6f0' : '#1a1625',
            border: themeMode === 'dark' ? '1px solid rgba(124,58,237,0.25)' : '1px solid rgba(124,58,237,0.15)',
            fontSize: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          },
          duration: 3500,
        }}
      />
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 300000, retry: 1, refetchOnWindowFocus: false } },
  }));

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </QueryClientProvider>
    </Provider>
  );
}