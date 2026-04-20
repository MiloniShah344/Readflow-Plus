/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  Box, Typography, TextField, Button, Alert,
  CircularProgress, InputAdornment, IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';
import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import { profileService } from '@/services/profile.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: 'rgba(124,58,237,0.04)',
  },
};

function SectionCard({
  title, icon, children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{
      p: 3.5, borderRadius: 3,
      border: '1px solid rgba(124,58,237,0.15)',
      bgcolor: 'rgba(124,58,237,0.02)',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{
          width: 38, height: 38, borderRadius: 2, flexShrink: 0,
          bgcolor: 'rgba(124,58,237,0.12)',
          border: '1px solid rgba(124,58,237,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>
          {icon}
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{title}</Typography>
      </Box>
      {children}
    </Box>
  );
}

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const themeMode = useAppSelector((s) => s.theme.mode);

  // Profile
  const [name, setName] = useState(user?.name || '');
  const [nameLoading, setNameLoading] = useState(false);

  // Password
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const saveName = async () => {
    setNameLoading(true);
    try {
      const updated = await profileService.updateMe({ name: name.trim() });
      // Update Redux store — this makes the sidebar re-render immediately
      dispatch(updateUser(updated as any));
      // Also sync localStorage
      const stored = localStorage.getItem('rf_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('rf_user', JSON.stringify({ ...parsed, name: name.trim() }));
      }
      toast.success('✅ Name updated!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to update name');
    } finally {
      setNameLoading(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);

    if (!oldPw || !newPw || !confirmPw) return setPwError('All fields are required');
    if (newPw !== confirmPw) return setPwError('New passwords do not match');
    if (newPw.length < 6) return setPwError('New password must be at least 6 characters');
    if (oldPw === newPw) return setPwError('New password must be different from your current password');

    setPwLoading(true);
    try {
      await profileService.changePassword(oldPw, newPw);
      setPwSuccess(true);
      setOldPw('');
      setNewPw('');
      setConfirmPw('');
      toast.success('🔒 Password changed successfully!');
    } catch (e: any) {
      setPwError(e.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const pwStrength =
    newPw.length === 0 ? 0
    : newPw.length < 6 ? 1
    : newPw.length < 10 ? 2
    : 3;
  const strengthColors = ['', '#ef4444', '#f59e0b', '#10b981'];
  const strengthLabels = ['', 'Too short', 'Fair', 'Strong'];

  // Reusable eye-toggle button
  const EyeBtn = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <InputAdornment position="end">
      <IconButton
        onClick={onToggle}
        edge="end"
        size="small"
        sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
      >
        {show
          ? <VisibilityOffIcon fontSize="small" />
          : <VisibilityIcon fontSize="small" />
        }
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box>
      <TopBar title="Settings" />
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 680 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>⚙️ Settings</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            Manage your account preferences
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* ── Profile ─────────────────────────────────────────── */}
          <SectionCard title="Profile" icon="👤">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Display Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={fieldSx}
                size="small"
                helperText="Shown in the sidebar"
              />
              <TextField
                label="Email address"
                fullWidth
                value={user?.email || ''}
                disabled
                sx={fieldSx}
                size="small"
                helperText="Email cannot be changed"
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={saveName}
                  disabled={nameLoading || name.trim() === (user?.name || '')}
                  startIcon={
                    nameLoading
                      ? <CircularProgress size={14} color="inherit" />
                      : <CheckIcon />
                  }
                  sx={{
                    borderColor: 'rgba(124,58,237,0.3)', color: '#a78bfa',
                    '&:hover': { borderColor: '#7c3aed', bgcolor: 'rgba(124,58,237,0.1)' },
                  }}
                >
                  Save Name
                </Button>
              </Box>
            </Box>
          </SectionCard>

          {/* ── Account info strip ──────────────────────────────── */}
          <Box sx={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2,
            p: 2.5, borderRadius: 3,
            border: '1px solid rgba(124,58,237,0.12)',
            bgcolor: 'rgba(124,58,237,0.03)',
          }}>
            {[
              { label: 'Level',    value: `${user?.level ?? 1}`, icon: '🏅' },
              { label: 'Total XP', value: `${user?.xp ?? 0}`,   icon: '⭐' },
              { label: 'Theme',    value: themeMode,              icon: '🌙' },
            ].map((s) => (
              <Box key={s.label} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 18, mb: 0.25 }}>{s.icon}</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#a78bfa' }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>

          {/* ── Change Password ──────────────────────────────────── */}
          <SectionCard title="Change Password" icon="🔒">
            {pwSuccess && (
              <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>
                Password changed successfully! You&apos;re all set.
              </Alert>
            )}
            {pwError && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                {pwError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={changePassword}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
            >
              {/* Current password */}
              <TextField
                label="Current Password"
                fullWidth
                required
                type={showOld ? 'text' : 'password'}
                value={oldPw}
                onChange={(e) => { setOldPw(e.target.value); setPwError(''); setPwSuccess(false); }}
                size="small"
                sx={fieldSx}
                slotProps={{ input: { endAdornment: <EyeBtn show={showOld} onToggle={() => setShowOld((p) => !p)} /> } }}
              />

              {/* New password + strength */}
              <Box>
                <TextField
                  label="New Password"
                  fullWidth
                  required
                  type={showNew ? 'text' : 'password'}
                  value={newPw}
                  onChange={(e) => { setNewPw(e.target.value); setPwError(''); }}
                  size="small"
                  sx={fieldSx}
                  slotProps={{ input: { endAdornment: <EyeBtn show={showNew} onToggle={() => setShowNew((p) => !p)} />} }}
                />
                {newPw.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      flex: 1, height: 4, borderRadius: 2,
                      bgcolor: 'rgba(124,58,237,0.1)', overflow: 'hidden',
                    }}>
                      <Box sx={{
                        height: '100%',
                        width: `${(pwStrength / 3) * 100}%`,
                        borderRadius: 2,
                        bgcolor: strengthColors[pwStrength],
                        transition: 'all 0.3s',
                      }} />
                    </Box>
                    <Typography sx={{
                      fontSize: 11, fontWeight: 600, minWidth: 50,
                      color: strengthColors[pwStrength],
                    }}>
                      {strengthLabels[pwStrength]}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Confirm new password */}
              <TextField
                label="Confirm New Password"
                fullWidth
                required
                type={showConfirm ? 'text' : 'password'}
                value={confirmPw}
                onChange={(e) => { setConfirmPw(e.target.value); setPwError(''); }}
                error={confirmPw.length > 0 && confirmPw !== newPw}
                helperText={confirmPw.length > 0 && confirmPw !== newPw ? 'Passwords do not match' : ''}
                size="small"
                sx={fieldSx}
                slotProps={{ input: { endAdornment: <EyeBtn show={showConfirm} onToggle={() => setShowConfirm((p) => !p)} />} }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={pwLoading || !oldPw || !newPw || !confirmPw}
                  sx={{ minWidth: 160 }}
                >
                  {pwLoading
                    ? <CircularProgress size={18} color="inherit" />
                    : '🔒 Change Password'
                  }
                </Button>
              </Box>
            </Box>
          </SectionCard>

        </Box>
      </Box>
    </Box>
  );
}