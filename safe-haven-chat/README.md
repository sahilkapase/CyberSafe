# CyberShield - Safe Haven Chat

A comprehensive real-time chat application with AI-powered cyberbullying detection and mitigation. Built with React + TypeScript frontend and FastAPI backend.

## Features

### 🛡️ Safety Features
- **Real-time AI Detection**: Groq LLM analyzes messages for cyberbullying, harassment, hate speech, and inappropriate content
- **Image/Video Detection**: HuggingFace models detect NSFW, inappropriate, or harmful visual content
- **Automatic Filtering**: Offensive words are automatically blurred/filtered
- **Warning System**: Progressive warnings with automatic blocking for repeat offenders
- **Evidence Logging**: Automatic screenshot capture and incident logging
- **User Tagging**: Red tag system for users with harassment history

### 💬 Chat Features
- **Real-time Messaging**: WebSocket-based instant messaging
- **Multiple Conversations**: Chat with multiple friends simultaneously
- **Message History**: Persistent message storage and retrieval
- **Typing Indicators**: Real-time typing status
- **Message Filtering**: Automatic content filtering based on AI detection

### 👥 Social Features
- **Friend System**: Send and accept friend requests
- **User Search**: Search for users by username or email
- **Friend Management**: View friends list and manage connections
- **Profile Management**: Edit profile information and settings

### 🧠 Mental Health Support
- **AI Counselor**: Mental health chatbot for emotional support
- **24/7 Availability**: Always available support system

### 👨‍💼 Admin Dashboard
- **Comprehensive Monitoring**: View all incidents, reports, and user activity
- **User Management**: Control user tags, block/unblock users
- **Report Generation**: Generate evidence reports with downloadable logs
- **Incident Review**: Review and manage detected incidents
- **Statistics Dashboard**: View platform-wide statistics

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material UI (MUI)** for components and icons
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **TanStack Query** for data fetching
- **WebSocket** for real-time communication
- **Vite** for build tooling

### Backend
- **FastAPI** for REST API and WebSocket
- **SQLAlchemy** for ORM
- **SQLite** for database (easily upgradeable to PostgreSQL)
- **Groq API** for LLM-based text analysis
- **HuggingFace Transformers** for image detection
- **JWT** for authentication
- **WebSockets** for real-time messaging

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Create virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Configure environment**:
```bash
cp .env.example .env
# Edit .env and add your API keys:
# - GROQ_API_KEY: Get from https://console.groq.com
# - HF_TOKEN: Get from https://huggingface.co/settings/tokens
# - SECRET_KEY: Generate a random secret key (e.g., using openssl rand -hex 32)
```

5. **Run the server**:
```bash
python main.py
# Or with uvicorn:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment** (optional):
Create a `.env` file in the root:
```
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000
```

3. **Run development server**:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Keys Required

### Groq API Key
1. Sign up at https://console.groq.com
2. Create an API key
3. Add to backend `.env` as `GROQ_API_KEY`

### HuggingFace Token
1. Sign up at https://huggingface.co
2. Go to Settings > Access Tokens
3. Create a token with read access
4. Add to backend `.env` as `HF_TOKEN`

## Project Structure

```
safe-haven-chat/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── auth.py          # Authentication endpoints
│   │   │       ├── friends.py       # Friend request endpoints
│   │   │       ├── messages.py      # Message endpoints
│   │   │       ├── websocket.py    # WebSocket chat handler
│   │   │       └── admin.py        # Admin dashboard endpoints
│   │   ├── core/
│   │   │   ├── config.py            # Configuration
│   │   │   ├── database.py         # Database setup
│   │   │   └── security.py         # Security utilities
│   │   ├── models/                 # Database models
│   │   ├── schemas/                # Pydantic schemas
│   │   └── services/
│   │       ├── ai_detection.py     # AI detection service
│   │       └── evidence_logger.py # Evidence logging
│   ├── main.py                     # FastAPI app entry point
│   └── requirements.txt
├── src/
│   ├── pages/
│   │   ├── Landing.tsx            # Landing page
│   │   ├── Login.tsx              # Login page
│   │   ├── Signup.tsx             # Signup page
│   │   ├── Chat.tsx               # Main chat interface
│   │   ├── Friends.tsx            # Friends management
│   │   ├── Profile.tsx            # User profile
│   │   ├── MentalHealth.tsx       # Mental health chatbot
│   │   └── Admin.tsx              # Admin dashboard
│   ├── lib/
│   │   └── api.ts                 # API client
│   └── hooks/
│       └── useWebSocket.ts        # WebSocket hook
└── package.json
```

## Usage

### Creating an Admin User

To create an admin user, you can either:
1. Manually update the database to set `role = 'admin'` for a user
2. Or modify the signup endpoint to allow admin creation (for development only)

### Testing the Application

1. **Start backend**: `cd backend && python main.py`
2. **Start frontend**: `npm run dev`
3. **Sign up**: Create a new account at `/signup`
4. **Add friends**: Go to `/friends` and search for users
5. **Start chatting**: Go to `/chat` and select a conversation
6. **Test AI detection**: Send messages with potentially offensive content to see detection in action

## Key Features Implementation

### AI Detection Flow

1. **Text Messages**:
   - Message sent → Groq LLM analyzes content
   - If abusive: Content filtered, incident logged, warning issued
   - After 3 warnings: Red tag applied
   - After 5 warnings: User blocked

2. **Images/Videos**:
   - Image uploaded → HuggingFace model analyzes
   - If unsafe: Upload blocked, incident logged
   - User receives warning

### WebSocket Real-time Chat

- Connection established with JWT token
- Messages sent/received in real-time
- Typing indicators
- Automatic reconnection on disconnect

### Evidence System

- All flagged messages logged to JSON files
- Screenshots saved (when implemented)
- Admin can generate comprehensive reports

## Future Enhancements

- [ ] Mobile app (iOS/Android)
- [ ] Integration with social media platforms
- [ ] Advanced ML models for better detection
- [ ] End-to-end encryption
- [ ] Voice and video calls
- [ ] Group chats
- [ ] File sharing with virus scanning
- [ ] Multi-language support

## Contributing

This is a project for cyberbullying prevention. Contributions are welcome!

## License

This project is part of the CyberShield initiative for safer online communication.

## Support

For issues or questions, please refer to the project documentation or contact the development team.
