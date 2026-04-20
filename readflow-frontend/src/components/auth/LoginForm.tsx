/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  Box, TextField, Button, Typography, Alert,
  CircularProgress, Link as MuiLink, InputAdornment, IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { authService } from '@/services/auth.service';

const darkField = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(255,255,255,0.04)',
    '& fieldset': { borderColor: 'rgba(124,58,237,0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(124,58,237,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
  },
  '& .MuiInputBase-input': { color: '#e8e6f0' },
  '& .MuiInputLabel-root': { color: '#9990b8' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#a78bfa' },
};

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      dispatch(setCredentials({ user: res.user, token: res.token }));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography sx={{ fontSize: 42, mb: 1, filter: 'drop-shadow(0 4px 12px rgba(124,58,237,0.4))' }}>
          📚
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#e8e6f0', mb: 0.5 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" sx={{ color: '#9990b8' }}>
          Continue your reading journey
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{
          mb: 3, borderRadius: 2,
          bgcolor: 'rgba(239,68,68,0.1)', color: '#fca5a5',
          border: '1px solid rgba(239,68,68,0.3)',
          '& .MuiAlert-icon': { color: '#ef4444' },
        }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          label="Email address"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          sx={darkField}
        />

        <TextField
          label="Password"
          type={showPw ? 'text' : 'password'}
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={darkField}
          slotProps={{
            input: {endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPw((p) => !p)}
                  edge="end"
                  size="small"
                  sx={{ color: '#9990b8', '&:hover': { color: '#a78bfa' } }}
                >
                  {showPw
                    ? <VisibilityOffIcon fontSize="small" />
                    : <VisibilityIcon fontSize="small" />
                  }
                </IconButton>
              </InputAdornment>
            )},
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ py: 1.5, fontSize: 16, fontWeight: 700, mt: 0.5 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Log In'}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#9990b8' }}>
        No account?{' '}
        <MuiLink
          component={Link}
          href="/register"
          sx={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none' }}
        >
          Create one free →
        </MuiLink>
      </Typography>
    </Box>
  );
}
