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
  '& .MuiFormHelperText-root': { color: '#6b6486' },
};

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await authService.register(email, password, name.trim() || '');
      dispatch(setCredentials({ user: res.user, token: res.token }));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981'];
  const strengthLabels = ['', 'Too short', 'Fair', 'Strong'];

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography sx={{ fontSize: 42, mb: 1, filter: 'drop-shadow(0 4px 12px rgba(124,58,237,0.4))' }}>🚀</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#e8e6f0', mb: 0.5 }}>Start reading smarter</Typography>
        <Typography variant="body2" sx={{ color: '#9990b8' }}>Free forever. No credit card.</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', '& .MuiAlert-icon': { color: '#ef4444' } }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          label="Display Name" fullWidth
          value={name} onChange={(e) => setName(e.target.value)}
          autoFocus placeholder="e.g. Alex" sx={darkField}
          helperText="Optional — shown in the sidebar"
        />
        <TextField
          label="Email address" type="email" fullWidth required
          value={email} onChange={(e) => setEmail(e.target.value)}
          sx={darkField}
        />

        {/* Password with strength indicator */}
        <Box>
          <TextField
            label="Password" fullWidth required
            type={showPw ? 'text' : 'password'}
            value={password} onChange={(e) => setPassword(e.target.value)}
            sx={darkField}
            slotProps={{
              input: {endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw((p) => !p)} edge="end" size="small"
                    sx={{ color: '#9990b8', '&:hover': { color: '#a78bfa' } }}>
                    {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              )},
            }}
          />
          {password.length > 0 && (
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: 'rgba(124,58,237,0.1)', overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: `${(pwStrength / 3) * 100}%`, borderRadius: 2, bgcolor: strengthColors[pwStrength], transition: 'all 0.3s' }} />
              </Box>
              <Typography sx={{ fontSize: 11, color: strengthColors[pwStrength], fontWeight: 600, minWidth: 50 }}>
                {strengthLabels[pwStrength]}
              </Typography>
            </Box>
          )}
        </Box>

        <TextField
          label="Confirm password" fullWidth required
          type={showConfirm ? 'text' : 'password'}
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          error={confirm.length > 0 && confirm !== password}
          helperText={confirm.length > 0 && confirm !== password ? 'Passwords do not match' : ''}
          sx={darkField}
          slotProps={{
            input: {endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end" size="small"
                  sx={{ color: '#9990b8', '&:hover': { color: '#a78bfa' } }}>
                  {showConfirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )},
          }}
        />

        <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
          sx={{ py: 1.5, fontSize: 16, fontWeight: 700, mt: 0.5 }}>
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