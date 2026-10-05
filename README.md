<div align="center">

<img src="https://img.shields.io/badge/GlobeTalk-Live-4F46E5?style=for-the-badge&logo=vercel&logoColor=white" alt="Live" />
<img src="https://img.shields.io/badge/MERN-Stack-10B981?style=for-the-badge&logo=mongodb&logoColor=white" alt="MERN" />
<img src="https://img.shields.io/badge/Socket.IO-Real--Time-7C3AED?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
<img src="https://img.shields.io/badge/Gemini_AI-Integrated-F59E0B?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />

<br /><br />

# 🌐 GlobeTalk

### A Real-Time, Multilingual AI-Powered Messaging Platform

**Break language barriers. Connect with anyone, anywhere — in their language.**

[**🚀 Live Demo**](https://globe-talk-brown.vercel.app) · [**📖 API Docs**](#-api-reference) · [**⚙️ Setup Guide**](#-getting-started)

</div>

---

## 📌 Overview

GlobeTalk is a production-deployed, full-stack chat application that eliminates language barriers in real-time communication. Users can message each other in any language — every message is automatically translated to each recipient's preferred language **before it arrives**, with zero friction.

Built to demonstrate end-to-end ownership across system design, real-time infrastructure, AI/LLM integration, and cloud deployment.

> **Live at:** https://globe-talk-brown.vercel.app

---

## ✨ Feature Highlights

| Feature | Description |
|---|---|
| 💬 **Real-Time Messaging** | Instant message delivery via Socket.IO with typing indicators and online presence |
| 🌍 **Auto-Translation** | Server-side per-recipient translation using Google Cloud Translate — 12 languages supported |
| 🤖 **AI Conversation Summary** | Gemini AI summarises long chats into bullet points with a single tap |
| ✨ **Smart Reply Suggestions** | Gemini analyses context and suggests 3 one-tap reply options |
| 🎙️ **Voice-to-Text** | Browser-native Web Speech API converts speech to text in your language |
| ✓✓ **Read Receipts** | Real-time message delivery (✓) and read (✓✓) ticks with instant Socket.IO sync |
| 🌙 **Dual Theme** | Premium Light and Dark mode with persistent localStorage preference |
| 📎 **File Attachments** | Images, videos, and documents via Cloudinary CDN |
| 👥 **Group Chats** | Create and manage group conversations with multiple members |
| 🔔 **Friend Requests** | Send, accept, and decline friend requests with live notifications |
| 📊 **Admin Dashboard** | Analytics panel with Chart.js — user stats, message volume, chat activity |
| 🔒 **Secure Auth** | JWT-based authentication with HTTP-only cookies |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework with lazy loading and Suspense |
| **Redux Toolkit + RTK Query** | Global state management and data fetching with cache invalidation |
| **Material UI (MUI v5)** | Component library with custom Indigo/Violet design system |
| **Framer Motion** | Micro-animations — message entrance, modal transitions, mic pulse |
| **Socket.IO Client** | Real-time bidirectional event communication |
| **React Router v6** | Client-side routing with protected routes |
| **Vite** | Fast build tooling and HMR |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server and Socket.IO host |
| **MongoDB + Mongoose** | Database with schemas for Users, Chats, Messages, Requests |
| **Socket.IO** | WebSocket server for real-time events |
| **Google Cloud Translate v2** | Server-side per-recipient message translation |
| **Google Gemini AI** (`@google/genai`) | Conversation summaries and smart reply generation |
| **Cloudinary** | Media storage for profile photos and file attachments |
| **JWT + cookie-parser** | Secure stateless authentication |
| **Multer** | Multipart file upload handling |

### Infrastructure
| Service | Role |
|---|---|
| **Vercel** | Frontend deployment (auto-deploy from `main`) |
| **Render** | Backend deployment (Node.js server) |
| **MongoDB Atlas** | Managed cloud database (M0 free tier) |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Vercel)                         │
│  React + Redux Toolkit + MUI + Framer Motion + Socket.IO Client │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTPS REST + WSS Socket.IO
┌───────────────────────────▼─────────────────────────────────────┐
│                      SERVER (Render)                            │
│              Node.js / Express / Socket.IO                      │
│                                                                 │
│  ┌─────────────┐  ┌──────────────────┐  ┌────────────────────┐ │
│  │  REST API   │  │  Socket Handlers  │  │   AI Controller    │ │
│  │  /api/v1/*  │  │  NEW_MESSAGE      │  │  /api/v1/ai/*      │ │
│  │  Auth, Chat │  │  MESSAGE_READ     │  │  Summarise         │ │
│  │  User, Admin│  │  START_TYPING     │  │  Smart Reply       │ │
│  └─────────────┘  └──────────────────┘  └────────────────────┘ │
└────────┬──────────────────┬──────────────────────┬─────────────┘
         │                  │                       │
┌────────▼──────┐  ┌────────▼────────┐  ┌──────────▼──────────┐
│ MongoDB Atlas │  │ Google Cloud    │  │  Google Gemini AI   │
│  Users        │  │ Translate API   │  │  gemini-3.8-flash   │
│  Chats        │  │ 12 languages    │  │  Fallback + retry   │
│  Messages     │  │ Per-recipient   │  │  backoff logic      │
│  Requests     │  └─────────────────┘  └─────────────────────┘
└───────────────┘
```

---

## 🔄 Real-Time Translation Flow

The translation pipeline is server-side, per-recipient, and happens before delivery — not after:

```
User A (English) sends: "Hello, how are you?"
         │
         ▼
  Socket.IO NEW_MESSAGE received on server
         │
         ├──▶ User B (French) preference?
         │         │
         │         ▼
         │    Google Translate → "Bonjour, comment allez-vous?"
         │         │
         │         ▼
         │    Emit to User B's socket with translated content
         │    + originalContent preserved for toggle
         │
         └──▶ Emit to User A's own socket (no translation)
```

Historical messages are also translated on fetch via the `getMessages` controller, ensuring the chat is always readable in the viewer's language.

---

## 🤖 AI Integration

### Conversation Summariser
- **Endpoint:** `POST /api/v1/ai/summarise`
- Fetches the last 50 messages from the database
- Sends them to Gemini with a structured prompt
- Returns a bullet-point summary of key topics discussed

### Smart Reply
- **Endpoint:** `POST /api/v1/ai/smartreply`
- Analyses the last 10 messages for context
- Generates 3 contextually relevant one-tap reply suggestions
- Chips are displayed below the AI bar and pre-fill the message input on tap

### Reliability
```js
// Model fallback chain with exponential backoff
const MODELS = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.5-flash-lite"];
// Retries on 503 (overload) and 429 (rate limit) before falling back
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free M0 tier works)
- Google Cloud account (Translate API)
- Google AI Studio account (Gemini API key — free tier)
- Cloudinary account (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/Akshar246/GlobeTalk.git
cd GlobeTalk
```

### 2. Install dependencies
```bash
# Backend
cd Server && npm install

# Frontend
cd ../Client && npm install
```

### 3. Configure environment variables

**Server — create `Server/.env`:**
```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/GlobeTalk
PORT=10000
JWT_SECRET=your_jwt_secret_here
ADMIN_SECRET_KEY=your_admin_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GOOGLE_API_KEY=your_google_cloud_translate_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=DEVELOPMENT
```

**Client — create `Client/.env`:**
```env
VITE_SERVER=http://localhost:10000
```

### 4. Run locally
```bash
# Terminal 1 — Backend
cd Server && node app.js

# Terminal 2 — Frontend
cd Client && npm run dev
```

App runs at `http://localhost:5173`

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/user/new` | Register new user |
| `POST` | `/api/v1/user/login` | Login |
| `GET` | `/api/v1/user/logout` | Logout |
| `GET` | `/api/v1/user/me` | Get current user profile |

### User
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/user/search?name=` | Search users (excludes self) |
| `PUT` | `/api/v1/user/sendrequest` | Send friend request |
| `PUT` | `/api/v1/user/acceptrequest` | Accept / decline request |
| `GET` | `/api/v1/user/notifications` | Get pending requests |
| `PATCH` | `/api/v1/user/language` | Update preferred language |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/chat/my` | Get all chats for current user |
| `GET` | `/api/v1/chat/message/:chatId` | Paginated message history (translated) |
| `POST` | `/api/v1/chat/message` | Send file attachment |
| `POST` | `/api/v1/chat/new` | Create group chat |
| `GET` | `/api/v1/chat/my/groups` | Get groups |

### AI
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/ai/summarise` | Summarise chat with Gemini |
| `POST` | `/api/v1/ai/smartreply` | Get 3 smart reply suggestions |

---

## 🔌 Socket.IO Events

| Event | Direction | Description |
|---|---|---|
| `NEW_MESSAGE` | Client → Server → Clients | Send message (translated per recipient) |
| `MESSAGE_READ` | Client → Server | User opened a chat — mark messages read |
| `MESSAGES_SEEN` | Server → Client | Notify sender: flip ✓ to ✓✓ |
| `START_TYPING` | Client → Server → Clients | Typing indicator on |
| `STOP_TYPING` | Client → Server → Clients | Typing indicator off |
| `CHAT_JOINED` | Client → Server | User entered a chat room |
| `CHAT_LEAVED` | Client → Server | User left a chat room |
| `ONLINE_USERS` | Server → Clients | Broadcast updated online set |
| `ALERT` | Server → Client | System message (e.g. group join) |

---

## 🌍 Supported Languages

| Code | Language | Code | Language |
|---|---|---|---|
| `en` | 🇬🇧 English | `ar` | 🇸🇦 Arabic |
| `hi` | 🇮🇳 Hindi | `pt` | 🇵🇹 Portuguese |
| `fr` | 🇫🇷 French | `ru` | 🇷🇺 Russian |
| `es` | 🇪🇸 Spanish | `ko` | 🇰🇷 Korean |
| `de` | 🇩🇪 German | `zh` | 🇨🇳 Chinese |
| `it` | 🇮🇹 Italian | `ja` | 🇯🇵 Japanese |

---

## 🚢 Deployment

The app is deployed across three free-tier cloud services:

| Layer | Platform | Config |
|---|---|---|
| **Frontend** | Vercel | Root Dir: `Client`, Framework: Vite, auto-deploy on push to `main` |
| **Backend** | Render | Root Dir: `Server`, Build: `npm install`, Start: `node app.js` |
| **Database** | MongoDB Atlas | M0 cluster, IP whitelisted to `0.0.0.0/0` for Render |

**Note:** Render's free tier sleeps after 15 minutes of inactivity. The frontend pings `/health` every 14 minutes to keep it awake.

---

## 📁 Project Structure

```
GlobeTalk/
├── Client/                   # React frontend
│   └── src/
│       ├── components/
│       │   ├── layout/       # AppLayout, Header, Loaders
│       │   ├── shared/       # MessageComponent, ChatItem, UserItem
│       │   ├── specific/     # AISummariser, VoiceInput, Search, Notifications
│       │   └── dialogs/      # FileMenu
│       ├── constants/        # color.js, theme.js, events.js, config.js
│       ├── pages/            # Chat, Home, Login, Groups, ProfilePage
│       ├── redux/
│       │   ├── api/          # RTK Query endpoints
│       │   └── reducers/     # auth, chat, misc slices
│       └── socket.jsx        # Socket.IO context provider
│
└── Server/                   # Node.js backend
    ├── controllers/          # user.js, chat.js, ai.js, admin.js
    ├── models/               # User, Chat, Message, Request
    ├── routes/               # user, chat, admin, ai, translate
    ├── middlewares/          # auth.js, error.js, multer.js
    ├── constants/            # config.js (CORS), events.js
    └── app.js                # Entry point, Socket.IO handlers
```

---

## 🔐 Security

- Passwords hashed with **bcrypt**
- Authentication via **JWT stored in HTTP-only cookies** (not localStorage)
- CORS restricted to known origins only
- Cloudinary API keys never exposed to the client
- File upload type validation via multer
- Admin routes protected by separate secret key middleware

---

## 👨‍💻 Author

**Akshar Patel**
MSc Artificial Intelligence — Brunel University London

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/akshar-patel)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github)](https://github.com/Akshar246)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ as a portfolio project — end-to-end, zero shortcuts.</sub>
</div>
