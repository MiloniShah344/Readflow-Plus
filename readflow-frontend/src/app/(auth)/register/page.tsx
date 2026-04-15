import RegisterForm from '@/components/auth/RegisterForm';
import { Box, Typography } from '@mui/material';

export default function RegisterPage() {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 30% 70%, rgba(124,58,237,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(245,158,11,0.07) 0%, transparent 50%), #07070d',
      px: 2,
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: 440,
        bgcolor: 'rgba(15,14,23,0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 4,
        p: { xs: 3, sm: 5 },
        border: '1px solid rgba(124,58,237,0.2)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
      }}>
        <RegisterForm />
      </Box>
    </Box>
  );
}