import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Container,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { apiClient, UserSummary } from '../lib/api';
import { toast } from 'sonner';

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await apiClient.getUsers();
            setUsers(data);
            setError(null);
        } catch (err: any) {
            console.error('Failed to load users:', err);
            setError('Failed to load users. Please ensure you have admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleBlockUser = async (userId: number) => {
        try {
            await apiClient.blockUser(userId);
            toast.success('User blocked successfully');
            loadUsers(); // Refresh list
        } catch (err: any) {
            toast.error('Failed to block user');
        }
    };

    const handleUnblockUser = async (userId: number) => {
        try {
            await apiClient.unblockUser(userId);
            toast.success('User unblocked successfully');
            loadUsers(); // Refresh list
        } catch (err: any) {
            toast.error('Failed to unblock user');
        }
    };

    const getSeverityColor = (hasRedTag: boolean) => {
        return hasRedTag ? 'error' : 'success';
    };

    const getSeverityLabel = (hasRedTag: boolean) => {
        return hasRedTag ? 'High Risk (Red Tag)' : 'Safe';
    };

    if (loading && users.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Admin Dashboard
                </Typography>
                <Button
                    startIcon={<RefreshIcon />}
                    variant="outlined"
                    onClick={loadUsers}
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Risk Level</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    hover
                                    sx={{
                                        backgroundColor: user.has_red_tag ? 'rgba(255, 0, 0, 0.05)' : 'inherit',
                                        '&:hover': { backgroundColor: user.has_red_tag ? 'rgba(255, 0, 0, 0.1) !important' : undefined }
                                    }}
                                >
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            {user.avatar_url && (
                                                <img
                                                    src={user.avatar_url}
                                                    alt={user.username}
                                                    style={{ width: 32, height: 32, borderRadius: '50%' }}
                                                />
                                            )}
                                            <Typography variant="body2" fontWeight="medium">
                                                {user.username}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.role || 'USER'}
                                            size="small"
                                            color={user.role === 'admin' ? 'secondary' : 'default'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.is_blocked ? 'Blocked' : 'Active'}
                                            size="small"
                                            color={user.is_blocked ? 'error' : 'success'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={user.has_red_tag ? <WarningIcon /> : <CheckCircleIcon />}
                                            label={getSeverityLabel(user.has_red_tag)}
                                            size="small"
                                            color={getSeverityColor(user.has_red_tag)}
                                            variant={user.has_red_tag ? 'filled' : 'outlined'}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {user.role !== 'admin' && (
                                            <Tooltip title={user.is_blocked ? "Unblock User" : "Block User"}>
                                                <IconButton
                                                    color={user.is_blocked ? 'success' : 'error'}
                                                    onClick={() => user.is_blocked ? handleUnblockUser(user.id) : handleBlockUser(user.id)}
                                                >
                                                    {user.is_blocked ? <CheckCircleIcon /> : <BlockIcon />}
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default AdminPanel;
