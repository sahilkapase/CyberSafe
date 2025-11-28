import { Box, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import BottomNavBar from '../BottomNavBar'; // Assuming this exists or will be moved

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    // Routes that don't use the main layout (e.g., auth pages, admin)
    const noLayoutRoutes = ['/login', '/signup', '/landing', '/admin', '/admin/dashboard'];
    let isNoLayout = noLayoutRoutes.includes(location.pathname);

    // Special handling for root path: if not authenticated, treat as no-layout (Landing)
    if (location.pathname === '/') {
        const isAuthenticated = !!sessionStorage.getItem("auth_token");
        if (!isAuthenticated) {
            isNoLayout = true;
        }
    }

    if (isNoLayout) {
        return <>{children}</>;
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Sidebar - Desktop */}
            {!isMobile && <Sidebar />}

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: { md: '280px' }, // Sidebar width
                    width: { md: `calc(100% - 280px)` },
                    minHeight: '100vh',
                    pb: { xs: 8, md: 0 }, // Space for bottom nav on mobile
                }}
            >
                {children}
            </Box>

            {/* Bottom Nav - Mobile */}
            {isMobile && (
                <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }}>
                    {/* We can reuse the existing BottomNavBar or create a new one */}
                    <BottomNavBar />
                </Box>
            )}
        </Box>
    );
};

export default MainLayout;
