'use client';
import { ReactNode, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';

function ThemeWrapper({ children }: { children: ReactNode }) {
  const themeMode = useAppSelector((s) => s.theme.mode);
  const dispatch = useAppDispatch();

  // Hydrate auth from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('rf_token');
    const userStr = localStorage.getItem('rf_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(initializeAuth({ token, user }));
      } catch {
        // Invalid stored data, ignore
      }
    }
  }, [dispatch]);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#6366f1',
        dark: '#4f46e5',
        light: '#818cf8',
      },
      secondary: {
        main: '#ec4899',
      },
      background: {
        default: themeMode === 'dark' ? '#0f0f10' : '#f8f9fc',
        paper: themeMode === 'dark' ? '#18181b' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
    shape: {
      borderRadius: 8,
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
            borderRadius: '10px',
            background: themeMode === 'dark' ? '#27272a' : '#fff',
            color: themeMode === 'dark' ? '#fff' : '#333',
            border: '1px solid',
            borderColor: themeMode === 'dark' ? '#3f3f46' : '#e4e4e7',
          },
          duration: 3000,
        }}
      />
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeWrapper>{children}</ThemeWrapper>
      </QueryClientProvider>
    </Provider>
  );
}