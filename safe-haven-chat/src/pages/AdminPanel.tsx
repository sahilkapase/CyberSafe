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
    Tooltip,
    Tabs,
    Tab,
    Card,
    CardContent
} from '@mui/material';
import {
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Refresh as RefreshIcon,
    Report as ReportIcon,
    Assignment as AssignmentIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import { apiClient, UserSummary } from '../lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Report {
    id: number;
    reporter_id: number;
    reported_user_id: number;
    reason: string;
    description: string;
    status: string;
    created_at: string;
    reporter?: UserSummary;
    reported_user?: UserSummary;
}

interface Incident {
    id: number;
    user_id: number;
    severity: string;
    detected_content: string;
    ai_analysis: string;
    created_at: string;
    user?: UserSummary;
}

const AdminPanel: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (tabValue === 0) {
                const data = await apiClient.getUsers();
                setUsers(data);
            } else if (tabValue === 1) {
                const data = await apiClient.getReports();
                setReports(data);
            } else if (tabValue === 2) {
                const data = await apiClient.getIncidents();
                setIncidents(data);
            }
        } catch (err: any) {
            console.error('Failed to load data:', err);
            setError('Failed to load data. Please ensure you have admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [tabValue]);

    const handleBlockUser = async (userId: number) => {
        try {
            await apiClient.blockUser(userId);
            toast.success('User blocked successfully');
            loadData();
        } catch (err: any) {
            toast.error('Failed to block user');
        }
    };

    const handleUnblockUser = async (userId: number) => {
        try {
            await apiClient.unblockUser(userId);
            toast.success('User unblocked successfully');
            loadData();
        } catch (err: any) {
            toast.error('Failed to unblock user');
        }
    };

    const handleResolveReport = async (reportId: number) => {
        try {
            await apiClient.resolveReport(reportId);
            toast.success('Report resolved');
            loadData();
        } catch (err: any) {
            toast.error('Failed to resolve report');
        }
    };

    const getSeverityColor = (severity: string | boolean) => {
        if (typeof severity === 'boolean') return severity ? 'error' : 'success';
        switch (severity?.toLowerCase()) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            default: return 'info';
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Admin Dashboard
                </Typography>
                <Button
                    startIcon={<RefreshIcon />}
                    variant="outlined"
                    onClick={loadData}
                >
                    Refresh
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Stats Overview */}
            {!loading && !error && (
                <Box sx={{ mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ bgcolor: 'primary.light', color: 'primary.dark', borderRadius: 3, boxShadow: 2 }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">Total Users</Typography>
                                        <Typography variant="h3" fontWeight="800">{users.length}</Typography>
                                    </Box>
                                    <PeopleIcon sx={{ fontSize: 60, opacity: 0.2 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ bgcolor: 'warning.light', color: 'warning.dark', borderRadius: 3, boxShadow: 2 }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">Active Reports</Typography>
                                        <Typography variant="h3" fontWeight="800">
                                            {reports.filter(r => r.status !== 'resolved').length}
                                        </Typography>
                                    </Box>
                                    <ReportIcon sx={{ fontSize: 60, opacity: 0.2 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ bgcolor: 'error.light', color: 'error.dark', borderRadius: 3, boxShadow: 2 }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">Incidents</Typography>
                                        <Typography variant="h3" fontWeight="800">{incidents.length}</Typography>
                                    </Box>
                                    <WarningIcon sx={{ fontSize: 60, opacity: 0.2 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, v) => setTabValue(v)}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<PeopleIcon />} label="Users" />
                    <Tab icon={<ReportIcon />} label="Reports" />
                    <Tab icon={<AssignmentIcon />} label="Incidents" />
                </Tabs>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* USERS TAB */}
                    {tabValue === 0 && (
                        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>User</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Email</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Role</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Risk Level</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id} hover sx={{ bgcolor: user.has_red_tag ? 'rgba(255,0,0,0.05)' : 'inherit' }}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        {user.avatar_url && (
                                                            <img src={user.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                                        )}
                                                        <Typography variant="body2" fontWeight="medium">{user.username}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Chip label={user.role || 'USER'} size="small" color={user.role === 'admin' ? 'secondary' : 'default'} />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={user.is_blocked ? 'Blocked' : 'Active'} size="small" color={user.is_blocked ? 'error' : 'success'} />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={user.has_red_tag ? <WarningIcon /> : <CheckCircleIcon />}
                                                        label={user.has_red_tag ? 'High Risk' : 'Safe'}
                                                        size="small"
                                                        color={user.has_red_tag ? 'error' : 'success'}
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
                    )}

                    {/* REPORTS TAB */}
                    {tabValue === 1 && (
                        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Reporter</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Reported User</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Reason</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Description</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Status</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reports.map((report) => (
                                            <TableRow key={report.id} hover>
                                                <TableCell>{format(new Date(report.created_at), 'MMM d, yyyy')}</TableCell>
                                                <TableCell>{report.reporter_id}</TableCell>
                                                <TableCell>{report.reported_user_id}</TableCell>
                                                <TableCell><Chip label={report.reason} size="small" /></TableCell>
                                                <TableCell sx={{ maxWidth: 300 }}>
                                                    <Typography noWrap variant="body2">{report.description}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={report.status}
                                                        size="small"
                                                        color={report.status === 'resolved' ? 'success' : 'warning'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    {report.status !== 'resolved' && (
                                                        <Button size="small" variant="contained" onClick={() => handleResolveReport(report.id)}>
                                                            Resolve
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {reports.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                    <Typography color="text.secondary">No reports found</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}

                    {/* INCIDENTS TAB */}
                    {tabValue === 2 && (
                        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 3 }}>
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>User ID</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Severity</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Content</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>AI Analysis</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {incidents.map((incident) => (
                                            <TableRow key={incident.id} hover>
                                                <TableCell>{format(new Date(incident.created_at), 'MMM d, yyyy HH:mm')}</TableCell>
                                                <TableCell>{incident.user_id}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={incident.severity.toUpperCase()}
                                                        size="small"
                                                        color={getSeverityColor(incident.severity) as any}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ maxWidth: 300 }}>
                                                    <Typography noWrap variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#f0f0f0', p: 0.5, borderRadius: 1 }}>
                                                        {incident.detected_content}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ maxWidth: 300 }}>
                                                    <Typography noWrap variant="body2">{incident.ai_analysis}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {incidents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                    <Typography color="text.secondary">No incidents found</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}
                </>
            )}
        </Container>
    );
};

export default AdminPanel;
