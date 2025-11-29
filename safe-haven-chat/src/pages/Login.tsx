import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Alert,
  CircularProgress,
  Grid,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { apiClient } from '@/lib/api';

const MotionBox = motion(Box);

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiClient.login(formData.email, formData.password);
      navigate('/chat');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate social login data
      const mockData = {
        email: provider === 'google' ? 'demo.google@example.com' : 'demo.facebook@example.com',
        username: provider === 'google' ? 'Google User' : 'Facebook User',
        provider: provider,
        avatar_url: provider === 'google'
          ? 'https://lh3.googleusercontent.com/a/ACg8ocIq8dJ0PO7_kRj_8j_kRj_8j_kRj_8j_kRj_8j_kRj_8=s96-c'
          : 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10158473684736847&height=50&width=50&ext=1699999999&hash=AeQ_kRj_8j_kRj_8'
      };

      await apiClient.socialLogin(
        mockData.email,
        mockData.username,
        mockData.provider,
        mockData.avatar_url
      );
      navigate('/chat');
    } catch (err: any) {
      setError(err.message || `${provider} login failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Side - Branding (Hidden on Mobile) */}
      {!isMobile && (
        <Box
          sx={{
            flex: 1,
            bgcolor: 'primary.main',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            p: 8,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, hsl(221, 83%, 53%), hsl(262, 83%, 58%))',
              opacity: 0.9,
              zIndex: 1,
            }}
          />
          {/* Decorative Circles */}
          <Box
            sx={{
              position: 'absolute',
              top: -100,
              left: -100,
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 0,
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ShieldRoundedIcon sx={{ fontSize: 120, mb: 4, opacity: 0.9 }} />
              <Typography variant="h2" fontWeight={800} sx={{ mb: 2 }}>
                Welcome Back
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.8, maxWidth: 400, mx: 'auto' }}>
                Secure, private, and intelligent conversations await.
              </Typography>
            </MotionBox>
          </Box>
        </Box>
      )}

      {/* Right Side - Form */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 500px', lg: '0 0 600px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 4, md: 8 },
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate('/')}
            sx={{ mb: 4, color: 'text.secondary' }}
          >
            Back to Home
          </Button>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Sign In
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your details to access your account.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: 'right' }}>
                <MuiLink
                  component="button"
                  variant="body2"
                  onClick={() => console.log('Forgot password')}
                  sx={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}
                >
                  Forgot Password?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-md)',
                  background: 'var(--gradient-primary)',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>

            <Divider sx={{ my: 4 }}>
              <Typography variant="caption" color="text.secondary">
                OR CONTINUE WITH
              </Typography>
            </Divider>

            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialLogin('google')}
                disabled={loading}
                sx={{ borderRadius: 2, py: 1 }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FacebookIcon />}
                onClick={() => handleSocialLogin('facebook')}
                disabled={loading}
                sx={{ borderRadius: 2, py: 1 }}
              >
                Facebook
              </Button>
            </Stack>

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <MuiLink
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/signup')}
                  sx={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}
                >
                  Sign Up
                </MuiLink>
              </Typography>
              <Box sx={{ mt: 2 }}>
                <MuiLink
                  component="button"
                  variant="caption"
                  onClick={() => navigate('/admin')}
                  sx={{ cursor: 'pointer', color: 'text.disabled', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                >
                  Admin Login
                </MuiLink>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
