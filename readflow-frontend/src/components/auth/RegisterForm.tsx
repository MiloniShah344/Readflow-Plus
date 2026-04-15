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

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.register(email, password);
      dispatch(setCredentials({ user: res.user, token: res.token }));
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
        Start reading smarter 📚
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mb={4}
      >
        Create your free ReadFlow+ account
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
        sx={{ mb: 2 }}
        required
        helperText="At least 6 characters"
      />

      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
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
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Create Account'
        )}
      </Button>

      <Typography variant="body2" textAlign="center" color="text.secondary">
        Already have an account?{' '}
        <MuiLink component={Link} href="/login" fontWeight={600}>
          Log in
        </MuiLink>
      </Typography>
    </Box>
  );
}