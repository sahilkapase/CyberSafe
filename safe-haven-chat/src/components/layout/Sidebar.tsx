import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Avatar,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { apiClient } from '@/lib/api';
import { useEffect, useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await apiClient.getMe();
                setUser(userData);
            } catch (error) {
                console.error('Failed to load user', error);
            }
        };
        loadUser();
    }, []);

    const menuItems = [
        { text: 'Home', icon: <HomeRoundedIcon />, path: '/' },
        { text: 'Chat', icon: <ChatBubbleRoundedIcon />, path: '/chat' },
        { text: 'Friends', icon: <PeopleRoundedIcon />, path: '/friends' },
        { text: 'Mental Health', icon: <PsychologyRoundedIcon />, path: '/mental-health' },
        { text: 'Profile', icon: <PersonRoundedIcon />, path: '/profile' },
    ];

    const handleLogout = () => {
        apiClient.setToken(null);
        navigate('/login');
    };

    if (isMobile) return null;

    return (
        <Box
            sx={{
                width: 280,
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper', // Fallback
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 1200,
            }}
            className="glass-panel"
        >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6, px: 2 }}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '12px',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: 'var(--shadow-md)',
                    }}
                >
                    <ShieldRoundedIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                    CyberShield
                </Typography>
            </Box>

            {/* Navigation */}
            <List sx={{ flex: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: '12px',
                                    py: 1.5,
                                    px: 2,
                                    bgcolor: isActive ? 'primary.light' : 'transparent',
                                    color: isActive ? 'primary.main' : 'text.secondary',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        bgcolor: isActive ? 'primary.light' : 'action.hover',
                                        transform: 'translateX(4px)',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: isActive ? 'primary.main' : 'inherit',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: '0.95rem',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* User Profile */}
            <Box
                sx={{
                    mt: 'auto',
                    p: 2,
                    borderRadius: '16px',
                    bgcolor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                        bgcolor: 'action.hover',
                        boxShadow: 'var(--shadow-sm)',
                    },
                }}
                onClick={() => navigate('/profile')}
            >
                <Avatar
                    src={user?.avatar_url}
                    sx={{
                        width: 40,
                        height: 40,
                        border: '2px solid',
                        borderColor: 'background.paper',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                >
                    {user?.username?.[0]?.toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                        {user?.full_name || user?.username || 'User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                        @{user?.username || 'username'}
                    </Typography>
                </Box>
                <Tooltip title="Logout">
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLogout();
                        }}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                    >
                        <LogoutRoundedIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default Sidebar;
