import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Grid,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import ReportRoundedIcon from '@mui/icons-material/ReportRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { apiClient } from '@/lib/api';

const Admin = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, incidentsData, analyticsData, usersData, reportsData] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getIncidents(),
        apiClient.getAnalytics(),
        apiClient.getUsers(),
        apiClient.getReports(),
      ]);

      setStats(statsData);
      setIncidents(incidentsData);
      setAnalytics(analyticsData);
      setUsers(usersData);
      setReports(reportsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewIncident = async (incident: any) => {
    try {
      const details = await apiClient.getIncidentDetails(incident.id);
      setSelectedIncident(details);
      setDialogOpen(true);
    } catch (error) {
      console.error('Failed to load incident details:', error);
    }
  };

  const handleUpdateIncidentStatus = async (incidentId: number, status: string) => {
    try {
      await apiClient.updateIncidentStatus(incidentId, status);
      setDialogOpen(false);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update incident:', error);
    }
  };

  const handleTagUser = async (userId: number, hasRedTag: boolean) => {
    try {
      await apiClient.updateUserTag(userId, hasRedTag);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to tag user:', error);
    }
  };

  const handleBlockUser = async (userId: number, isBlocked: boolean) => {
    try {
      await apiClient.blockUser(userId, isBlocked);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const statsCards = [
    { label: 'Total Users', value: stats?.users?.total || 0, icon: <PeopleRoundedIcon />, color: 'primary' },
    { label: 'Active Incidents', value: stats?.incidents?.pending || 0, icon: <ReportRoundedIcon />, color: 'warning' },
    { label: 'High Severity', value: stats?.incidents?.high_severity || 0, icon: <WarningRoundedIcon />, color: 'error' },
    { label: 'Red Tagged Users', value: stats?.users?.red_tagged || 0, icon: <BlockRoundedIcon />, color: 'error' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4, pb: 10 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/chat')} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Dashboard
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card elevation={0} className="glass-panel">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: `${stat.color}.light`, color: `${stat.color}.main`, width: 56, height: 56 }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Paper className="glass-panel" sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} variant="fullWidth">
            <Tab label="Incidents" />
            <Tab label="Reports" />
            <Tab label="Users" />
            <Tab label="Analytics" />
          </Tabs>
        </Paper>

        {/* Incidents Tab */}
        {tabValue === 0 && (
          <Card elevation={0} className="glass-panel">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Recent Incidents
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Content</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {incidents.map((incident) => (
                      <TableRow key={incident.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {incident.user?.username?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {incident.user?.username || 'Unknown'}
                              </Typography>
                              {incident.user?.has_red_tag && (
                                <Chip label="Red Tag" color="error" size="small" sx={{ mt: 0.5 }} />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                            {incident.detected_content}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={incident.severity?.toUpperCase()}
                            color={getSeverityColor(incident.severity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label={incident.status} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(incident.created_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewIncident(incident)}
                          >
                            <VisibilityRoundedIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Reports Tab */}
        {tabValue === 1 && (
          <Card elevation={0} className="glass-panel">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                User Reports
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Reporter</TableCell>
                      <TableCell>Reported User</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id} hover>
                        <TableCell>{report.reporter?.username || 'Unknown'}</TableCell>
                        <TableCell>{report.reported_user?.username || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip label={report.report_type} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                            {report.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={report.status} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(report.created_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Users Tab */}
        {tabValue === 2 && (
          <Card elevation={0} className="glass-panel">
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                User Management
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Warnings</TableCell>
                      <TableCell>Incidents</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {user.username?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                              {user.username}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip label={user.warning_count} size="small" color={user.warning_count > 0 ? 'warning' : 'default'} />
                        </TableCell>
                        <TableCell>
                          <Chip label={user.incident_count || 0} size="small" />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            {user.has_red_tag && <Chip label="Red Tag" color="error" size="small" />}
                            {user.is_blocked && <Chip label="Blocked" color="error" size="small" />}
                            {!user.has_red_tag && !user.is_blocked && <Chip label="Active" color="success" size="small" />}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              color={user.has_red_tag ? 'success' : 'warning'}
                              onClick={() => handleTagUser(user.id, !user.has_red_tag)}
                            >
                              {user.has_red_tag ? 'Remove Tag' : 'Tag'}
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleBlockUser(user.id, !user.is_blocked)}
                            >
                              {user.is_blocked ? 'Unblock' : 'Block'}
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Analytics Tab */}
        {tabValue === 3 && analytics && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={0} className="glass-panel">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Severity Distribution
                  </Typography>
                  {analytics.severity_distribution?.map((item: any) => (
                    <Box key={item.severity} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{item.severity}</Typography>
                        <Typography variant="body2" fontWeight={600}>{item.count}</Typography>
                      </Box>
                      <Box sx={{ height: 8, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(item.count / Math.max(...analytics.severity_distribution.map((i: any) => i.count))) * 100}%`,
                            bgcolor: getSeverityColor(item.severity) + '.main',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card elevation={0} className="glass-panel">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Top Violators
                  </Typography>
                  {analytics.top_violators?.map((violator: any, index: number) => (
                    <Box key={violator.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" color="text.secondary">#{index + 1}</Typography>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {violator.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{violator.username}</Typography>
                          {violator.has_red_tag && <Chip label="Red Tag" color="error" size="small" sx={{ mt: 0.5 }} />}
                        </Box>
                      </Box>
                      <Chip label={`${violator.incident_count} incidents`} color="error" />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Incident Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Incident Details</DialogTitle>
        <DialogContent>
          {selectedIncident && (
            <Box sx={{ pt: 2 }}>
              {/* User Information */}
              <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Violator Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar src={selectedIncident.user?.avatar_url} sx={{ width: 48, height: 48 }}>
                    {selectedIncident.user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedIncident.user?.username}</Typography>
                    <Typography variant="body2" color="text.secondary">{selectedIncident.user?.email}</Typography>
                  </Box>
                  {selectedIncident.user?.has_red_tag && (
                    <Chip label="Red Tagged" color="error" size="small" />
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Warnings</Typography>
                    <Typography variant="body1" fontWeight={600}>{selectedIncident.user?.warning_count || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedIncident.user?.is_blocked ? 'Blocked' : 'Active'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Incident Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Incident Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Severity</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        label={selectedIncident.severity?.toUpperCase()}
                        color={getSeverityColor(selectedIncident.severity)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip label={selectedIncident.status} size="small" variant="outlined" />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Detected Content</Typography>
                    <Paper sx={{ p: 2, mt: 1, bgcolor: 'error.light', color: 'error.dark' }}>
                      <Typography variant="body2">{selectedIncident.detected_content}</Typography>
                    </Paper>
                  </Grid>
                  {selectedIncident.ai_analysis && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">AI Analysis</Typography>
                      <Paper sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                        <Typography variant="body2">{selectedIncident.ai_analysis}</Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>

              {/* Conversation Context */}
              {selectedIncident.conversation_context && selectedIncident.conversation_context.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Conversation Context
                  </Typography>
                  <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto', bgcolor: 'grey.50' }}>
                    {selectedIncident.conversation_context.map((msg: any) => (
                      <Box
                        key={msg.id}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: msg.is_incident_message ? 'error.light' : 'background.paper',
                          border: msg.is_incident_message ? '2px solid' : 'none',
                          borderColor: 'error.main',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar src={msg.sender?.avatar_url} sx={{ width: 24, height: 24 }}>
                            {msg.sender?.username?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="caption" fontWeight={600}>
                            {msg.sender?.username}
                          </Typography>
                          {msg.is_flagged && <Chip label="Flagged" color="warning" size="small" />}
                        </Box>
                        <Typography variant="body2">{msg.content}</Typography>
                        {msg.content_filtered && msg.content_filtered !== msg.content && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Filtered: {msg.content_filtered}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Paper>
                </Box>
              )}

              {/* Screenshot */}
              {selectedIncident.screenshot_path && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Screenshot Evidence
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      Screenshot path: {selectedIncident.screenshot_path}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      (Screenshot display would be implemented here)
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          {selectedIncident && (
            <>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => handleTagUser(selectedIncident.user?.id, true)}
              >
                Tag User
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleBlockUser(selectedIncident.user?.id, true)}
              >
                Block User
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleUpdateIncidentStatus(selectedIncident.id, 'resolved')}
              >
                Mark Resolved
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;
