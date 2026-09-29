# GlobeTalk — Project Status

> Updated at the end of every session.
> Start every AI session with: **"Read PROJECT_STATUS.md and let's continue"**

---

## Last Updated
2026-09-29 — Days 7+8 complete ✅ — Language fix, Voice-to-Text, full UI overhaul, Profile page

## Live URLs
- Frontend: https://globe-talk-brown.vercel.app ✅
- Backend: https://globetalk-server-7n6b.onrender.com ✅
- MongoDB: arivo-cluster → GlobeTalk database ✅

---

## 10-Day Roadmap

| Day | Feature | Status |
|---|---|---|
| 1 | Foundation & Cleanup | ✅ Done |
| 2 | Deployment (Atlas + Render + Vercel) | ✅ Done |
| 3 | Server-side Translation Pipeline | ✅ Done |
| 4 | In-app Language Switcher | ✅ Done |
| 5 | Gemini AI Conversation Summariser | ✅ Done |
| 6 | Gemini Smart Reply Suggestions | ✅ Done |
| 7 | Voice-to-Text (Web Speech API) | ✅ Done |
| 8 | Full UI/UX Overhaul + Profile page | ✅ Done |
| 9 | Read Receipts (✓✓ ticks) | ⬜ Next |
| 10 | Portfolio Polish (README, screenshots) | ⬜ |

---

## Everything That's Built

### Core App
- MERN chat app: login, signup, friend requests, group chats
- Real-time via Socket.IO, file attachments via Cloudinary + multer
- Admin dashboard with Chart.js analytics

### Translation System
- Per-recipient server-side translation on every NEW_MESSAGE (Socket handler in app.js ~line 106)
- Historical messages translated via getMessages controller
- 12-language picker in Header (PATCH /api/v1/user/language)
- Language stored in MongoDB User model + localStorage
- "Show original / Show translation" toggle in MessageComponent
- Language change → Message cache invalidation (NOW WORKING — bug was missing providesTags)

### AI Features
- POST /api/v1/ai/summarise — Gemini last 50 messages → bullet summary
- POST /api/v1/ai/smartreply — Gemini last 10 messages → 3 reply chips
- ✨ AI button in chat toolbar opens AISummariser dialog
- Smart reply chips pre-fill message input
- SDK: @google/genai (new unified SDK, NOT legacy @google/generative-ai)
- Model fallback: gemini-3.8-flash → gemini-3.7-flash → gemini-3.5-flash-lite
- Retry with exponential backoff for 503/429

### Voice-to-Text (Day 7)
- VoiceInput.jsx — browser-native Web Speech API, zero cost
- 12-language locale map auto-set from preferredLanguage localStorage
- Pulsing mic animation while recording
- Transcript appends to message input
- Hidden on unsupported browsers (Safari)

### UI Design System (Day 8)
- Brand: Indigo #4F46E5 / Violet #7C3AED / Gold #F59E0B
- constants/theme.js — full MUI light + dark themes (Inter font)
- main.jsx — ThemeProvider with localStorage persistence
- Toggle: 🌙/☀️ icon in Header
- Dot-grid background pattern in chat area

### Pages & Components Upgraded
| Component | What was done |
|---|---|
| Login.jsx | Full redesign: split screen, animated glassmorphism feature cards, pill tab switcher, show/hide password, AnimatePresence transitions |
| Home.jsx | Premium empty state with dot-grid, gradient icon, feature pills |
| ProfilePage.jsx | NEW `/profile` route: hero banner, gradient avatar ring, stats row, edit form, friends list |
| Header.jsx | Gradient AppBar, 🌐 logo, 🌙 theme toggle, 👤 profile link |
| AppLayout.jsx | Theme-aware 3-column layout |
| ChatItem.jsx | Gradient active state, left border accent, unread badge |
| MessageComponent.jsx | Indigo gradient sent bubbles, 18px tails, dark received |
| Chat.jsx | Dot-grid bg, gradient send button, VoiceInput mic button |
| Notifications.jsx | Gradient header, polished Accept/Decline, empty state |
| Search.jsx | Gradient header, indigo-accented field, premium empty states |
| Profile.jsx (sidebar) | Gradient avatar ring, bio chip, branded info rows |
| AISummariser.jsx | Dark mode aware dialog |

---

## Key Architecture Facts

- **CORS**: Both `app.js` AND `constants/config.js` must have Vercel URL + PATCH
- **Cookie**: Name `Globe-token`, sameSite:"none", secure:true
- **Gemini SDK**: `@google/genai` NOT `@google/generative-ai`
- **RTK cache tags**: Chat, User, Message — all three now have providesTags
- **Language blank page bug**: Was missing `providesTags: ["Message"]` on getMessages query — now fixed
- **Theme toggle**: `window.__setGlobeTalkTheme("dark"|"light")` from main.jsx
- **Profile route**: `/profile` — protected, uses AppLayout HOC

---

## Environment Variables

### Server (Render)
```
MONGO_URI=mongodb+srv://...@arivo-cluster.n3fkzq1.mongodb.net/GlobeTalk
PORT=10000
JWT_SECRET=...
ADMIN_SECRET_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_API_KEY=...  (Google Cloud Translate)
GEMINI_API_KEY=...  (aistudio.google.com)
CLIENT_URL=https://globe-talk-brown.vercel.app
NODE_ENV=PRODUCTION
```

### Client (Vercel)
```
VITE_SERVER=https://globetalk-server-7n6b.onrender.com
```

---

## What's Next (Day 9)

**Read Receipts** — show ✓ (sent) and ✓✓ (read) ticks on messages
- Add `readBy: [{ type: ObjectId, ref: 'User' }]` field to Message model
- Emit `MESSAGE_READ` socket event when user opens a chat
- Update MessageComponent.jsx to show single/double tick based on readBy
