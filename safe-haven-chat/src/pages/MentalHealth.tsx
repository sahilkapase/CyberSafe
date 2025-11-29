import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  IconButton,
  Paper,
  Avatar,
  InputAdornment,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { apiClient } from '@/lib/api';
import AppNav from '@/components/AppNav';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const MentalHealth = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm here to support you. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    apiClient
      .getMe()
      .then((user) => setIsAdmin(user.role === 'admin'))
      .catch(() => setIsAdmin(false));
  }, []);

  const conversationPayload = useMemo(
    () =>
      messages.slice(-6).map((msg) => ({
        sender: msg.sender,
        text: msg.text,
      })),
    [messages]
  );

  const handleSendMessage = async (preset?: string) => {
    const trimmed = (preset ?? inputMessage).trim();
    if (!trimmed) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setIsBotTyping(true);
    setError(null);

    try {
      const history = [...conversationPayload, { sender: 'user', text: trimmed }];
      const response = await apiClient.mentalHealthChat(trimmed, history);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: response.reply,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setError('Unable to reach the support assistant. Showing a calming tip instead.');
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "I'm having trouble connecting right now, but remember to take a deep breath and focus on something you can see, something you can touch, and something you can hear around you.",
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleChipSelect = (text: string) => {
    setInputMessage(text);
    handleSendMessage(text);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4, pb: 10 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/chat')} sx={{ bgcolor: 'background.paper' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FavoriteIcon sx={{ color: 'error.main' }} />
              Mental Health Support
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confidential AI counseling available 24/7
            </Typography>
          </Box>
        </Box>

        <Card sx={{ mb: 3, bgcolor: 'secondary.light' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PsychologyIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Safe Space Reminder
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This is a judgment-free zone. Your conversations are private and confidential.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Paper
          sx={{
            height: 'calc(100vh - 350px)',
            display: 'flex',
            flexDirection: 'column',
            mb: 2,
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 2,
                }}
              >
                {message.sender === 'bot' && (
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <PsychologyIcon />
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
                {message.sender === 'user' && (
                  <Avatar sx={{ bgcolor: 'primary.main' }}>U</Avatar>
                )}
              </Box>
            ))}
            {isBotTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <PsychologyIcon />
                </Avatar>
                <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    Aurora is responding...
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            {error && (
              <Typography variant="caption" color="error.main" sx={{ mb: 1, display: 'block' }}>
                {error}
              </Typography>
            )}
            <TextField
              fullWidth
              placeholder="Share your thoughts..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              multiline
              maxRows={4}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary" onClick={() => handleSendMessage()} disabled={isBotTyping}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Chip label="I'm feeling anxious" variant="outlined" clickable onClick={() => handleChipSelect("I'm feeling anxious and overwhelmed. Can you help me calm down?")} />
          <Chip label="Need someone to talk to" variant="outlined" clickable onClick={() => handleChipSelect("I just need someone to talk to. I feel really alone right now.")} />
          <Chip label="Stress at work" variant="outlined" clickable onClick={() => handleChipSelect("Work has been extremely stressful lately and I can't switch off.")} />
          <Chip label="Coping tips" variant="outlined" clickable onClick={() => handleChipSelect("Can you share some quick coping strategies for when I'm spiraling?")} />
        </Box>
      </Container>

      {/* <AppNav current="wellness" showAdmin={isAdmin} /> */}
    </Box>
  );
};

export default MentalHealth;
