import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Container,
    IconButton,
    Paper,
    Stack,
    Typography,
    useTheme,
    Avatar,
    LinearProgress,
    Grid,
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
import AppNav from '@/components/AppNav';

const Home = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [user, setUser] = useState<UserSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await apiClient.getCurrentUser();
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
        <Box sx={{ minHeight: '100vh', pb: 12 }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Welcome Section */}
                <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} gutterBottom>
                            Welcome back, {user?.full_name?.split(' ')[0] || user?.username}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Here's what's happening in your secure space.
                        </Typography>
                    </Box>
                    <IconButton sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
                        <NotificationsRoundedIcon color="action" />
                    </IconButton>
                </Box>

                <Grid container spacing={4}>
                    {/* Quick Actions */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Quick Actions
                        </Typography>
                        <Grid container spacing={2}>
                            {quickActions.map((action) => (
                                <Grid size={{ xs: 12, sm: 4 }} key={action.title}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            borderRadius: 4,
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 },
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <CardActionArea onClick={() => navigate(action.path)} sx={{ height: '100%', p: 2 }}>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 3,
                                                    bgcolor: action.color,
                                                    width: 'fit-content',
                                                    mb: 2,
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {action.icon}
                                            </Box>
                                            <Typography variant="h6" fontWeight={700}>
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
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                Recent Activity
                            </Typography>
                            <Paper
                                className="glass-panel"
                                sx={{
                                    p: 4,
                                    textAlign: 'center',
                                    bgcolor: 'background.default',
                                    borderStyle: 'dashed',
                                }}
                            >
                                <Typography color="text.secondary">
                                    Your recent conversations and friend requests will appear here.
                                </Typography>
                                <Button
                                    variant="text"
                                    endIcon={<ArrowForwardRoundedIcon />}
                                    onClick={() => navigate('/chat')}
                                    sx={{ mt: 1 }}
                                >
                                    Start a conversation
                                </Button>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Sidebar / Safety Status */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>
                            <Paper className="glass-panel" sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SecurityRoundedIcon color="primary" />
                                    Safety Overview
                                </Typography>

                                <Box sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: user?.has_red_tag ? 'warning.light' : 'success.light', color: user?.has_red_tag ? 'warning.dark' : 'success.dark' }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        {user?.has_red_tag ? <GppBadRoundedIcon /> : <VerifiedUserRoundedIcon />}
                                        <Typography fontWeight={700}>
                                            {user?.has_red_tag ? 'Attention Needed' : 'Account Secure'}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        {user?.has_red_tag
                                            ? 'Your account has been flagged. Please review community guidelines.'
                                            : 'You are in good standing. Keep up the positive interactions!'}
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 3 }}>
                                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Trust Score</Typography>
                                        <Typography variant="body2" fontWeight={700}>
                                            {user?.has_red_tag ? 'Low' : 'High'}
                                        </Typography>
                                    </Stack>
                                    <LinearProgress
                                        variant="determinate"
                                        value={user?.has_red_tag ? 30 : 95}
                                        color={user?.has_red_tag ? 'warning' : 'success'}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                            </Paper>

                            <Paper className="glass-panel" sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Need help?
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                                    Our AI Counselor is available 24/7 to support your mental well-being.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    onClick={() => navigate('/mental-health')}
                                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                                >
                                    Chat Now
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
