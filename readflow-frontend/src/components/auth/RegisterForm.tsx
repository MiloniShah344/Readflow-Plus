/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Box, TextField, Button, Typography, Alert, CircularProgress, Link as MuiLink } from '@mui/material';
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
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await authService.register(name, email, password);
      dispatch(setCredentials({ user: res.user, token: res.token }));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography sx={{ fontSize: 40, mb: 1 }}>🚀</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#e8e6f0', mb: 0.5 }}>Start reading smarter</Typography>
        <Typography variant="body2" sx={{ color: '#9990b8' }}>Free forever. No credit card.</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField label="Name" type="email" fullWidth value={name}
          onChange={(e) => setName(e.target.value)} required autoFocus
          sx={{ '& .MuiInputBase-input': { color: '#e8e6f0' }, '& .MuiInputLabel-root': { color: '#9990b8' } }}
        />
        <TextField label="Email address" type="email" fullWidth value={email}
          onChange={(e) => setEmail(e.target.value)} required
          sx={{ '& .MuiInputBase-input': { color: '#e8e6f0' }, '& .MuiInputLabel-root': { color: '#9990b8' } }}
        />
        <TextField label="Password" type="password" fullWidth value={password}
          onChange={(e) => setPassword(e.target.value)} required helperText="At least 6 characters"
          sx={{ '& .MuiInputBase-input': { color: '#e8e6f0' }, '& .MuiInputLabel-root': { color: '#9990b8' }, '& .MuiFormHelperText-root': { color: '#9990b8' } }}
        />
        <TextField label="Confirm password" type="password" fullWidth value={confirm}
          onChange={(e) => setConfirm(e.target.value)} required
          sx={{ '& .MuiInputBase-input': { color: '#e8e6f0' }, '& .MuiInputLabel-root': { color: '#9990b8' } }}
        />
        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
          sx={{ py: 1.5, fontSize: 16, fontWeight: 700, mt: 1 }}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#9990b8' }}>
        Already have an account?{' '}
        <MuiLink component={Link} href="/login" sx={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none' }}>
          Log in →
        </MuiLink>
      </Typography>
    </Box>
  );
}