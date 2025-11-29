import { useState, useEffect } from 'react';
import {
    Paper,
    Stack,
    Typography,
    useTheme,
    Avatar,
    LinearProgress,
    Grid2 as Grid,
    Box,
    Container,
    IconButton,
    Card,
    CardActionArea,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import GppBadRoundedIcon from '@mui/icons-material/GppBadRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { apiClient, UserSummary } from '@/lib/api';


const Home = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [user, setUser] = useState<UserSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await apiClient.getMe();
                setUser(userData);
            } catch (error) {
                console.error('Failed to load user:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const quickActions = [
        {
            title: 'Messages',
            icon: <ChatBubbleRoundedIcon fontSize="large" sx={{ color: 'primary.main' }} />,
            desc: 'Connect securely',
            path: '/chat',
            color: 'primary.light',
        },
        {
            title: 'Friends',
            icon: <PeopleAltRoundedIcon fontSize="large" sx={{ color: 'secondary.main' }} />,
            desc: 'Manage connections',
            path: '/friends',
            color: 'secondary.light',
        },
        {
            title: 'Wellness',
            icon: <PsychologyRoundedIcon fontSize="large" sx={{ color: 'success.main' }} />,
            desc: 'AI Support',
            path: '/mental-health',
            color: 'success.light',
        },
    ];

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <Box sx={{ minHeight: '100vh', pb: 12, background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(240,244,255,0.5) 100%)' }}>
            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* Welcome Section */}
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h3" fontWeight={800} gutterBottom sx={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Welcome back, {user?.full_name?.split(' ')[0] || user?.username}!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" fontWeight="normal">
                            Here's what's happening in your secure space.
                        </Typography>
                    </Box>
                    <IconButton sx={{ bgcolor: 'background.paper', boxShadow: 3, p: 1.5 }}>
                        <NotificationsRoundedIcon color="primary" />
                    </IconButton>
                </Box>

                <Grid container spacing={4}>
                    {/* Quick Actions */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span style={{ width: 4, height: 24, backgroundColor: 'var(--primary)', borderRadius: 2, display: 'block' }}></span>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={3}>
                            {quickActions.map((action) => (
                                <Grid size={{ xs: 12, sm: 4 }} key={action.title}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            borderRadius: 4,
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)' },
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            overflow: 'visible'
                                        }}
                                    >
                                        <CardActionArea onClick={() => navigate(action.path)} sx={{ height: '100%', p: 3 }}>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor: action.color,
                                                    width: 'fit-content',
                                                    mb: 2,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                                }}
                                            >
                                                {action.icon}
                                            </Box>
                                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                                {action.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {action.desc}
                                            </Typography>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Recent Activity Placeholder */}
                        <Box sx={{ mt: 6 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span style={{ width: 4, height: 24, backgroundColor: 'var(--secondary)', borderRadius: 2, display: 'block' }}></span>
                                Recent Activity
                            </Typography>
                            <Paper
                                className="glass-panel"
                                sx={{
                                    p: 6,
                                    textAlign: 'center',
                                    bgcolor: 'rgba(255,255,255,0.6)',
                                    border: '2px dashed',
                                    borderColor: 'divider',
                                    borderRadius: 4
                                }}
                            >
                                <Box sx={{ mb: 2, opacity: 0.5 }}>
                                    <ChatBubbleRoundedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                                </Box>
                                <Typography variant="h6" color="text.primary" gutterBottom>
                                    No recent activity
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                                    Your secure conversations and friend requests will appear here once you start interacting.
                                </Typography>
                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForwardRoundedIcon />}
                                    onClick={() => navigate('/chat')}
                                    sx={{
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1,
                                        background: 'var(--gradient-primary)',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                >
                                    Start a conversation
                                </Button>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Sidebar / Safety Status */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>
                            <Paper className="glass-panel" sx={{ p: 3, borderRadius: 4 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SecurityRoundedIcon color="primary" />
                                    Safety Overview
                                </Typography>

                                <Box sx={{ mt: 3, p: 3, borderRadius: 3, bgcolor: user?.has_red_tag ? '#FEF2F2' : '#F0FDF4', border: '1px solid', borderColor: user?.has_red_tag ? '#FECACA' : '#BBF7D0' }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        {user?.has_red_tag ? <GppBadRoundedIcon color="error" /> : <VerifiedUserRoundedIcon color="success" />}
                                        <Typography fontWeight={700} color={user?.has_red_tag ? 'error.main' : 'success.main'}>
                                            {user?.has_red_tag ? 'Attention Needed' : 'Account Secure'}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" sx={{ opacity: 0.8, color: user?.has_red_tag ? 'error.dark' : 'success.dark' }}>
                                        {user?.has_red_tag
                                            ? 'Your account has been flagged. Please review community guidelines.'
                                            : 'You are in good standing. Keep up the positive interactions!'}
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 4 }}>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                        <Typography variant="body2" fontWeight={600} color="text.secondary">Trust Score</Typography>
                                        <Typography variant="body2" fontWeight={700} color="primary">
                                            {user?.has_red_tag ? 'Low' : 'High'}
                                        </Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={user?.has_red_tag ? 30 : 95}
                                        color={user?.has_red_tag ? 'warning' : 'success'}
                                        sx={{ height: 10, borderRadius: 5, bgcolor: 'grey.100' }}
                                    />
                                </Box>
                            </Paper>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    background: 'var(--gradient-secondary)',
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                                    <PsychologyRoundedIcon sx={{ fontSize: 150 }} />
                                </Box>

                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Need help?
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 3, position: 'relative', zIndex: 1 }}>
                                    Our AI Counselor is available 24/7 to support your mental well-being with confidential guidance.
                                </Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate('/mental-health')}
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'success.main',
                                        fontWeight: 'bold',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                                    }}
                                >
                                    Chat with Aurora
                                </Button>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;
