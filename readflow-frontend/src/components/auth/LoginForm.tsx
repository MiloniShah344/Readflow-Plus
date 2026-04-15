'use client';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { authService } from '@/services/auth.service';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await authService.login(email, password);
      dispatch(setCredentials({ user: res.user, token: res.token }));
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: '100%', maxWidth: 400 }}
    >
      <Typography variant="h4" fontWeight={800} mb={0.5} textAlign="center">
        Welcome back 👋
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mb={4}
      >
        Log in to continue your reading journey
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
        required
        autoFocus
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
        required
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isLoading}
        sx={{ borderRadius: 2, py: 1.5, fontWeight: 600, mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
      </Button>

      <Typography variant="body2" textAlign="center" color="text.secondary">
        Don&apos;t have an account?{' '}
        <MuiLink component={Link} href="/register" fontWeight={600}>
          Create one free
        </MuiLink>
      </Typography>
    </Box>
  );
}