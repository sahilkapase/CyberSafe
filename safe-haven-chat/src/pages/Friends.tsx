import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import { useNavigate } from 'react-router-dom';
import { apiClient, FriendRequestDetail, UserSummary } from '@/lib/api';
import AppNav from '@/components/AppNav';

const Friends = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<UserSummary[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequestDetail[]>([]);
  const [allRequests, setAllRequests] = useState<FriendRequestDetail[]>([]);
  const [searchResults, setSearchResults] = useState<UserSummary[]>([]);
  const [currentUser, setCurrentUser] = useState<UserSummary | null>(null);
  const isAdmin = currentUser?.role === 'admin';
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const openChat = (user: UserSummary) => {
    navigate('/chat', { state: { user } });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [user, friendList, receivedRequests, myRequests] = await Promise.all([
        apiClient.getCurrentUser(),
        apiClient.getFriendsList(),
        apiClient.getReceivedFriendRequests(),
        apiClient.getFriendRequests(),
      ]);

      setCurrentUser(user);
      setFriends(friendList);
      setPendingRequests(receivedRequests);
      setAllRequests(myRequests);
    } catch (error) {
      console.error('Failed to load friends:', error);
      setFeedback('Unable to load your social graph. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (tabValue !== 2 || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await apiClient.searchUsers(searchQuery.trim());
        setSearchResults(results.filter((user) => user.id !== currentUser?.id));
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery, currentUser, tabValue]);

  const friendFilter = useMemo(
    () =>
      friends.filter((friend) =>
        searchQuery
          ? friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          friend.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      ),
    [friends, searchQuery]
  );

  const getRelationshipStatus = (userId: number) => {
    if (friends.some((friend) => friend.id === userId)) return 'friend';

    const incoming = pendingRequests.find((req) => req.sender.id === userId);
    if (incoming) return 'incoming';

    const outgoing = allRequests.find(
      (req) => req.sender.id === currentUser?.id && req.receiver.id === userId && req.status === 'pending'
    );
    if (outgoing) return 'outgoing';

    return 'none';
  };

  const renderMainSection = () => {
    if (tabValue === 0) {
      return (
        <Paper className="glass-panel" sx={{ p: 4 }}>
          <TextField
            fullWidth
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: 'background.default' }
            }}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : friendFilter.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, opacity: 0.7 }}>
              <PeopleAltRoundedIcon sx={{ fontSize: 60, mb: 2, color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                No connections yet.
              </Typography>
              <Button sx={{ mt: 2 }} variant="contained" onClick={() => setTabValue(2)}>
                Discover People
              </Button>
            </Box>
          ) : (
            <List>
              {friendFilter.map((friend) => (
                <ListItem key={friend.id} sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListItemAvatar>
                    <Avatar src={friend.avatar_url} sx={{ width: 48, height: 48 }}>
                      {(friend.full_name || friend.username).charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {friend.full_name || friend.username}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        @{friend.username}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" startIcon={<ChatBubbleRoundedIcon />} onClick={() => openChat(friend)} sx={{ borderRadius: 3 }}>
                      Chat
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      );
    }

    if (tabValue === 1) {
      return (
        <Paper className="glass-panel" sx={{ p: 4 }}>
          {pendingRequests.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, opacity: 0.7 }}>
              <PendingActionsRoundedIcon sx={{ fontSize: 60, mb: 2, color: 'text.secondary' }} />
              <Typography variant="h6" color="text.secondary">
                No pending requests
              </Typography>
            </Box>
          ) : (
            <List>
              {pendingRequests.map((request) => (
                <ListItem key={request.id} sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListItemAvatar>
                    <Avatar src={request.sender.avatar_url} sx={{ width: 48, height: 48 }}>
                      {(request.sender.full_name || request.sender.username).charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {request.sender.full_name || request.sender.username}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        @{request.sender.username}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="success"
                        onClick={() => handleRespondRequest(request.id, 'accepted')}
                        sx={{ bgcolor: 'success.light', '&:hover': { bgcolor: 'success.main', color: 'white' } }}
                      >
                        <CheckRoundedIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleRespondRequest(request.id, 'rejected')}
                        sx={{ bgcolor: 'error.light', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                      >
                        <CloseRoundedIcon />
                      </IconButton>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      );
    }

    return (
      <Paper className="glass-panel" sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Discover new friends
        </Typography>
        <TextField
          fullWidth
          placeholder="Search by username or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 3, bgcolor: 'background.default' }
          }}
        />
        {searchLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {searchResults.length > 0 && (
          <List sx={{ mt: 3 }}>
            {searchResults.map((user) => {
              const status = getRelationshipStatus(user.id);
              return (
                <ListItem key={user.id} sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListItemAvatar>
                    <Avatar src={user.avatar_url} sx={{ width: 48, height: 48 }}>
                      {(user.full_name || user.username).charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 600 }}>{user.full_name || user.username}</Typography>}
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        @{user.username}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    {status === 'friend' && (
                      <Button variant="outlined" onClick={() => openChat(user)} sx={{ borderRadius: 3 }}>
                        Chat
                      </Button>
                    )}
                    {status === 'incoming' && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          const request = pendingRequests.find((req) => req.sender.id === user.id);
                          if (request) handleRespondRequest(request.id, 'accepted');
                        }}
                        sx={{ borderRadius: 3 }}
                      >
                        Accept
                      </Button>
                    )}
                    {status === 'outgoing' && (
                      <Chip label="Request sent" color="warning" sx={{ fontWeight: 600 }} />
                    )}
                    {status === 'none' && (
                      <Button variant="contained" onClick={() => handleSendRequest(user.id)} sx={{ borderRadius: 3 }}>
                        Add Friend
                      </Button>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        )}
      </Paper>
    );
  };

  const handleSendRequest = async (userId: number) => {
    try {
      await apiClient.sendFriendRequest(userId);
      setFeedback('Friend request sent!');
      await loadData();
    } catch (error: any) {
      setFeedback(error.message || 'Unable to send request.');
    }
  };

  const handleRespondRequest = async (requestId: number, status: 'accepted' | 'rejected') => {
    try {
      await apiClient.respondToFriendRequest(requestId, status);
      setFeedback(status === 'accepted' ? 'Friend request accepted' : 'Request declined');
      await loadData();
    } catch (error: any) {
      setFeedback(error.message || 'Unable to update request.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 12 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/chat')} sx={{ bgcolor: 'white', boxShadow: 1 }}>
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Social Circle
          </Typography>
        </Box>

        {feedback && (
          <Alert severity="info" sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
            {feedback}
          </Alert>
        )}

        <Paper className="glass-panel" sx={{ mb: 3, p: 1 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': { borderRadius: 2, minHeight: 48 },
              '& .Mui-selected': { bgcolor: 'rgba(59, 130, 246, 0.1)' }
            }}
          >
            <Tab label={`Connections (${friends.length})`} icon={<PeopleAltRoundedIcon />} iconPosition="start" />
            <Tab label={`Requests (${pendingRequests.length})`} icon={<PendingActionsRoundedIcon />} iconPosition="start" />
            <Tab label="Discover" icon={<PersonAddRoundedIcon />} iconPosition="start" />
          </Tabs>
        </Paper>

        <Grid container spacing={3} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 8 }} sx={{ width: '100%' }}>
            <Box height="100%">{renderMainSection()}</Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }} sx={{ width: '100%' }}>
            <Stack spacing={3}>
              <Paper className="glass-panel" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Tips for safer connections
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  • Accept requests only from people you know.<br />
                  • Look for the red-tag indicator before chatting.<br />
                  • Report any suspicious behavior to admins.
                </Typography>
                <Button variant="outlined" fullWidth onClick={() => setTabValue(1)} sx={{ borderRadius: 3 }}>
                  Review pending requests
                </Button>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* <AppNav current="friends" showAdmin={isAdmin} /> */}
    </Box>
  );
};

export default Friends;
