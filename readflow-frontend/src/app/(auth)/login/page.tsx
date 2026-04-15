import { Box } from '@mui/material';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f10 0%, #1a1a2e 50%, #0f0f10 100%)',
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: 'background.paper',
          borderRadius: 4,
          p: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
}