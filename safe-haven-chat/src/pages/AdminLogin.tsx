import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { apiClient } from '@/lib/api';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.login(email, password);

            // Check if user is admin
            const user = await apiClient.getMe();
            if (user.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                apiClient.setToken(null);
                setLoading(false);
                return;
            }

            // Redirect to admin dashboard
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
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
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                }}
            />

            <Container maxWidth="sm">
                <Card
                    elevation={24}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        backdropFilter: 'blur(20px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                >
                    <Box
                        sx={{
                            p: 4,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            textAlign: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                mb: 2,
                            }}
                        >
                            <AdminPanelSettingsRoundedIcon sx={{ fontSize: 48 }} />
                        </Box>
                        <Typography variant="h4" fontWeight={800} gutterBottom>
                            Admin Portal
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            CyberShield Safe Haven Chat
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                label="Admin Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{ mb: 3 }}
                                InputProps={{
                                    sx: { borderRadius: 2 },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                sx={{ mb: 4 }}
                                InputProps={{
                                    sx: { borderRadius: 2 },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                    },
                                }}
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Authorized personnel only
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                        variant="text"
                        onClick={() => navigate('/')}
                        sx={{
                            color: 'white',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        ← Back to Main Site
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default AdminLogin;
