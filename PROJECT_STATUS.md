# GlobeTalk — Project Status

> This file is updated at the end of every development session.
> Start every AI session with: "Read PROJECT_STATUS.md and let's continue."

---

## Last Updated
2026-09-25 — Days 3–6 complete ✅, AI bugs being fixed

## Live URLs
- Frontend (Vercel): https://globe-talk-brown.vercel.app ✅ LIVE
- Backend (Render): https://globetalk-server-7n6b.onrender.com ✅ LIVE
- MongoDB Atlas: arivo-cluster → GlobeTalk database ✅ CONNECTED

---

## Completed ✅

### Core App
- MERN stack chat app — login, signup, friend requests, group chats
- Real-time messaging via Socket.IO
- File attachments via Cloudinary + multer
- Admin dashboard with Chart.js analytics

### Translation System
- Server-side per-recipient translation on NEW_MESSAGE (app.js socket handler)
- Server-side translation for historical messages in getMessages controller
- Language stored in User model (MongoDB)
- Language picker at signup (Login.jsx)
- In-app language switcher in Header (PATCH /api/v1/user/language)
- Message "Show original / Show translation" toggle (MessageComponent.jsx)
- RTK Query Message cache invalidated on language change (no more blank page)

### AI Features
- POST /api/v1/ai/summarise — Gemini reads last 50 messages → bullet-point summary
- POST /api/v1/ai/smartreply — Gemini reads last 10 messages → 3 reply chips
- AISummariser.jsx component — ✨ AI button in orange chat bar
- Smart reply chips pre-fill message input on click
- Uses new @google/genai SDK (NOT legacy @google/generative-ai)
- Model fallback list: gemini-3.8-flash → gemini-3.7-flash → gemini-3.5-flash-lite
- Exponential backoff retry for 503/429 errors

### Bug Fixes Done
- CORS: Added PATCH method + correct Vercel URL to corsOptions
- Keep-alive ping every 14min (prevents Render free tier sleeping)
- /health endpoint on backend
- Search: excluded logged-in user from own results ($nin includes req.user)
- Notifications: invalidate User RTK cache on NEW_REQUEST socket event + toast
- Language change: invalidate Message cache → no blank page
- Cloudinary error message now exposes real reason
- Removed console.log(language) debug from newUser controller
- Removed unused uuid import from user routes
- Search.jsx: null guard, loading spinner, empty state, autoFocus, 500ms debounce

### Deployment
- Backend: Render.com (Node.js free tier, auto-deploy from main branch)
- Frontend: Vercel (Vite, auto-deploy from main branch)
- MongoDB: Atlas M0 free cluster (arivo-cluster), GlobeTalk database

---

## In Progress 🔄
- Day 5/6: AI features — Gemini SDK migrated, testing in progress

---

## Next Up 📋
1. Day 7 — Voice-to-Text (Web Speech API, zero cost, browser-native)
2. Day 8 — UI/UX Overhaul (dark mode, better bubbles, mobile)
3. Day 9 — Read Receipts (✓✓ ticks)
4. Day 10 — Portfolio Polish (final README, LinkedIn, screenshots)

---

## 10-Day Roadmap

| Day | Task | Status |
|---|---|---|
| 1 | Foundation & Cleanup | ✅ Done |
| 2 | Free Deployment (Atlas + Render + Vercel) | ✅ Done |
| 3 | Server-side Translation Pipeline | ✅ Done |
| 4 | In-app Language Switcher | ✅ Done |
| 5 | AI: Conversation Summariser (Gemini) | ✅ Done |
| 6 | AI: Smart Reply Suggestions (Gemini) | ✅ Done |
| 7 | AI: Voice-to-Text (Web Speech API) | ⬜ Next |
| 8 | UI/UX Overhaul | ⬜ |
| 9 | Read Receipts + Admin Upgrade | ⬜ |
| 10 | GitHub Portfolio Polish | ⬜ |

---

## Architecture — Key Files

| Purpose | File | Notes |
|---|---|---|
| Socket + real-time translate | `Server/app.js` lines ~106–191 | Per-recipient translate on NEW_MESSAGE |
| Chat page | `Client/src/pages/Chat.jsx` | Has AISummariser wired in |
| AI summariser UI | `Client/src/components/specific/AISummariser.jsx` | ✨ button + dialog |
| AI controller | `Server/controllers/ai.js` | Gemini, retry, fallback models |
| AI routes | `Server/routes/ai.js` | POST /summarise, POST /smartreply |
| Message component | `Client/src/components/shared/MessageComponent.jsx` | Has original/translated toggle |
| Translate API route | `Server/routes/translate.js` | Rate limited, 12 languages |
| User model | `Server/models/user.js` | Has language field |
| Header | `Client/src/components/layout/Header.jsx` | Language picker dropdown |
| Redux API | `Client/src/redux/api/api.js` | All RTK Query endpoints incl. AI |
| AppLayout | `Client/src/components/layout/AppLayout.jsx` | Socket events, notification badge |

---

## Critical Technical Decisions

- **Gemini SDK**: Use `@google/genai` (new unified SDK), NOT `@google/generative-ai` (legacy)
- **Gemini model**: Use `gemini-3.8-flash` with fallback to `gemini-3.7-flash`, `gemini-3.5-flash-lite`
- **CORS**: Both `app.js` AND `constants/config.js` must have Vercel URL + PATCH method
- **Cookie**: Name is `Globe-token`, sameSite: "none", secure: true (required for cross-domain)
- **DB name**: Hardcoded as `"GlobeTalk"` in `connectDB` — MONGO_URI just needs cluster URL
- **emitEvent**: Only works in HTTP route controllers (has req object). Socket handlers access io directly.
- **RTK Query cache**: Invalidate `["Message"]` on language change, `["User"]` on new friend request

---

## Environment Variables Reference

### Server (.env / Render)
```
MONGO_URI=mongodb+srv://user:pass@arivo-cluster.n3fkzq1.mongodb.net/GlobeTalk
PORT=10000
JWT_SECRET=<long random string>
ADMIN_SECRET_KEY=<long random string>
CLOUDINARY_CLOUD_NAME=<from cloudinary dashboard>
CLOUDINARY_API_KEY=<from cloudinary dashboard>
CLOUDINARY_API_SECRET=<from cloudinary dashboard>
GOOGLE_API_KEY=<Google Cloud Translate API key>
GEMINI_API_KEY=<Google AI Studio key — aistudio.google.com>
CLIENT_URL=https://globe-talk-brown.vercel.app
NODE_ENV=PRODUCTION
```

### Client (.env / Vercel)
```
VITE_SERVER=https://globetalk-server-7n6b.onrender.com
```
