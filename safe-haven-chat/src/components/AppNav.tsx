
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Person as PersonIcon,
    People as PeopleIcon,
    Chat as ChatIcon,
    Psychology as PsychologyIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { apiClient } from '@/lib/api';

const AppNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        apiClient.setToken(null);
        navigate('/login');
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        handleClose();
    };

    if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
        return null;
    }

    return (
        <AppBar position="sticky" className="glass-panel" sx={{ zIndex: 1200 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    CyberSafe
                </Typography>

                {!isMobile && (
                    <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
                        <IconButton color={location.pathname === '/home' ? 'primary' : 'default'} onClick={() => navigate('/home')}>
                            <HomeIcon />
                        </IconButton>
                        <IconButton color={location.pathname === '/chat' ? 'primary' : 'default'} onClick={() => navigate('/chat')}>
                            <ChatIcon />
                        </IconButton>
                        <IconButton color={location.pathname === '/friends' ? 'primary' : 'default'} onClick={() => navigate('/friends')}>
                            <PeopleIcon />
                        </IconButton>
                        <IconButton color={location.pathname === '/mental-health' ? 'primary' : 'default'} onClick={() => navigate('/mental-health')}>
                            <PsychologyIcon />
                        </IconButton>
                    </Box>
                )}

                <Box>
                    <IconButton
                        onClick={handleMenu}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'var(--primary)' }}>U</Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={() => handleNavigate('/profile')}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate('/settings')}>
                            <ListItemIcon>
                                <SettingsIcon fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppNav;
