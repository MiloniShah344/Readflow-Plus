import LoginForm from '@/components/auth/LoginForm';
import { Box, Typography } from '@mui/material';

export default function LoginPage() {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.08) 0%, transparent 50%), #07070d',
    }}>
      {/* Left panel */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' },
        width: '45%',
        flexDirection: 'column',
        justifyContent: 'center',
        px: 8,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" sx={{
            fontWeight: 900,
            background: 'linear-gradient(135deg, #a78bfa, #7c3aed, #f59e0b)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            mb: 2, lineHeight: 1.1,
          }}>
            ReadFlow+
          </Typography>
          <Typography variant="h5" sx={{ color: '#9990b8', fontWeight: 400, mb: 4, lineHeight: 1.6 }}>
            Turn every page into progress. Track, gamify, and grow your reading habit.
          </Typography>
          {[
            { icon: '📚', text: 'Track every book you read' },
            { icon: '🏆', text: 'Earn XP and unlock achievements' },
            { icon: '🔥', text: 'Build reading streaks' },
            { icon: '📊', text: 'Get deep reading insights' },
          ].map((item) => (
            <Box key={item.text} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ fontSize: 24 }}>{item.icon}</Box>
              <Typography sx={{ color: '#b8b4d0', fontSize: 16 }}>{item.text}</Typography>
            </Box>
          ))}
        </Box>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -100, right: 50, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06), transparent)', pointerEvents: 'none' }} />
      </Box>

      {/* Right panel */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 4 },
      }}>
        <Box sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: 'rgba(15,14,23,0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          p: { xs: 3, sm: 5 },
          border: '1px solid rgba(124,58,237,0.2)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.05)',
        }}>
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
}