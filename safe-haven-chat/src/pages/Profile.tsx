import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  TextField,
  Typography,
  Paper,
  Stack,
  Divider,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import GppBadRoundedIcon from '@mui/icons-material/GppBadRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import { apiClient } from '@/lib/api';
import AppNav from '@/components/AppNav';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    phone: '',
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warningCount, setWarningCount] = useState(0);
  const [hasRedTag, setHasRedTag] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const user = await apiClient.getCurrentUser();
        setIsAdmin(user.role === 'admin');
        setWarningCount(user.warning_count || 0);
        setHasRedTag(user.has_red_tag);
        setAvatarUrl(user.avatar_url || null);
        setProfileData({
          name: user.full_name || user.username,
          username: user.username,
          email: user.email,
          bio:
            user.bio ||
            'Share something about yourself so your friends know what makes you unique.',
          phone: user.phone || '',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    // In a real app, we would make an API call here
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 12 }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/chat')} sx={{ bgcolor: 'white', boxShadow: 1 }}>
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Profile
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={4}>
            {/* Main Profile Card */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper className="glass-panel" sx={{ p: 0, overflow: 'hidden' }}>
                <Box sx={{ height: 140, background: 'var(--gradient-primary)', opacity: 0.8 }} />
                <Box sx={{ px: 4, pb: 4, mt: -6 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        src={avatarUrl || undefined}
                        sx={{
                          width: 120,
                          height: 120,
                          bgcolor: 'white',
                          border: '4px solid white',
                          fontSize: '3rem',
                          color: 'primary.main',
                          boxShadow: 'var(--shadow-lg)',
                        }}
                      >
                        {(profileData.name || profileData.username).charAt(0).toUpperCase()}
                      </Avatar>
                      {isEditing && (
                        <IconButton
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' },
                            boxShadow: 2,
                          }}
                        >
                          <PhotoCameraRoundedIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <Box>
                      {isEditing ? (
                        <Stack direction="row" spacing={1}>
                          <Button variant="outlined" color="inherit" startIcon={<CancelRoundedIcon />} onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={handleSave}>
                            Save
                          </Button>
                        </Stack>
                      ) : (
                        <Button variant="outlined" startIcon={<EditRoundedIcon />} onClick={() => setIsEditing(true)}>
                          Edit Profile
                        </Button>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {profileData.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      @{profileData.username}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        icon={hasRedTag ? <GppBadRoundedIcon /> : <VerifiedUserRoundedIcon />}
                        label={hasRedTag ? 'Under Review' : 'Verified User'}
                        color={hasRedTag ? 'warning' : 'success'}
                        variant="outlined"
                        size="small"
                      />
                      {isAdmin && <Chip label="Admin" color="secondary" size="small" />}
                    </Stack>
                  </Box>

                  <Divider sx={{ mb: 4 }} />

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!isEditing}
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: 3 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Username"
                        value={profileData.username}
                        disabled
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: 3 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: 3 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: 3 } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Bio"
                        multiline
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        disabled={!isEditing}
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: 3 } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Sidebar Stats */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                <Paper className="glass-panel" sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityRoundedIcon color="primary" />
                    Safety Status
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ p: 2, bgcolor: hasRedTag ? 'warning.light' : 'success.light', borderRadius: 3, color: hasRedTag ? 'warning.dark' : 'success.dark' }}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Current Standing
                      </Typography>
                      <Typography variant="body2">
                        {hasRedTag ? 'Your account is under review due to recent flags.' : 'Your account is in good standing.'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'background.default', borderRadius: 3 }}>
                      <Typography variant="body2" color="text.secondary">Warnings</Typography>
                      <Typography variant="h6" fontWeight={700}>{warningCount}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'background.default', borderRadius: 3 }}>
                      <Typography variant="body2" color="text.secondary">AI Monitoring</Typography>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                  </Box>
                </Paper>

                <Paper className="glass-panel" sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Quick Actions
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    <Button variant="outlined" fullWidth onClick={() => navigate('/friends')} sx={{ justifyContent: 'flex-start', borderRadius: 3 }}>
                      Manage Connections
                    </Button>
                    <Button variant="outlined" fullWidth onClick={() => navigate('/mental-health')} sx={{ justifyContent: 'flex-start', borderRadius: 3 }}>
                      Wellness Hub
                    </Button>
                    {isAdmin && (
                      <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate('/admin')} sx={{ justifyContent: 'flex-start', borderRadius: 3 }}>
                        Admin Dashboard
                      </Button>
                    )}
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* <AppNav current="profile" showAdmin={isAdmin} /> */}
    </Box>
  );
};

export default Profile;
