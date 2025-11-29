import { useEffect, useMemo, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api';

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await apiClient.getMe();
        setIsAdmin(user.role === 'admin');
      } catch (error) {
        console.error('Failed to check admin status', error);
      }
    };
    checkAdmin();
  }, []);

  const items = useMemo(() => {
    const base = [
      { value: 'home', label: 'Home', icon: <HomeRoundedIcon />, path: '/' },
      { value: 'chat', label: 'Chat', icon: <ChatBubbleOutlineIcon />, path: '/chat' },
      { value: 'friends', label: 'Friends', icon: <GroupAddIcon />, path: '/friends' },
      { value: 'wellness', label: 'Wellness', icon: <FavoriteBorderIcon />, path: '/mental-health' },
      { value: 'profile', label: 'Profile', icon: <PersonOutlineIcon />, path: '/profile' },
    ];
    if (isAdmin) {
      base.push({ value: 'admin', label: 'Admin', icon: <DashboardCustomizeIcon />, path: '/admin' });
    }
    return base;
  }, [isAdmin]);

  const currentValue =
    items.find((item) => location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)))?.value ?? 'home';

  return (
    <Paper
      elevation={10}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderRadius: '24px 24px 0 0',
        zIndex: 1300,
      }}
    >
      <BottomNavigation
        value={currentValue}
        onChange={(_event, value) => {
          const target = items.find((item) => item.value === value);
          if (target) {
            navigate(target.path);
          }
        }}
        showLabels
      >
        {items.map((item) => (
          <BottomNavigationAction
            key={item.value}
            value={item.value}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar;

