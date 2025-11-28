import { Box, Button, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShieldRoundedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Real-time Protection',
      description: 'AI-powered detection identifies harmful content instantly to keep conversations safe.'
    },
    {
      icon: <ChatBubbleRoundedIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Safe Messaging',
      description: 'Connect with friends through secure, monitored chat with automatic safety features.'
    },
    {
      icon: <PsychologyRoundedIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Mental Health Support',
      description: 'Access our AI counselor anytime for guidance and emotional support.'
    },
    {
      icon: <SecurityRoundedIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'User Verification',
      description: 'Advanced behavioral tracking helps identify and flag problematic users.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0) 70%)',
          zIndex: -1,
        }}
      />

      <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 16 }, pb: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '12px',
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    display: 'flex'
                  }}
                >
                  <ShieldRoundedIcon fontSize="small" />
                </Box>
                <Typography variant="subtitle2" color="primary.main" fontWeight={700} sx={{ letterSpacing: 1 }}>
                  SECURE & PRIVATE
                </Typography>
              </Stack>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 3,
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Social Media, <br />
                Reimagined for Safety.
              </Typography>

              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 5, maxWidth: 500, lineHeight: 1.6, fontWeight: 400 }}
              >
                Experience a new standard of digital connection. AI-driven protection, mental health support, and a community built on trust.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    px: 4,
                    py: 1.8,
                    borderRadius: '16px',
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: 'var(--shadow-lg)',
                    background: 'var(--gradient-primary)',
                    '&:hover': {
                      boxShadow: 'var(--shadow-xl)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 4,
                    py: 1.8,
                    borderRadius: '16px',
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderWidth: 2,
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: 'primary.main',
                      bgcolor: 'transparent',
                    }
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </MotionBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              sx={{ position: 'relative' }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 3,
                }}
              >
                {features.map((feature, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    className="glass-panel"
                    sx={{
                      p: 3,
                      borderRadius: '24px',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 'var(--shadow-xl)',
                      }
                    }}
                  >
                    <Box sx={{ mb: 2, p: 1.5, borderRadius: '16px', bgcolor: 'background.default', width: 'fit-content' }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Landing;
