# GlobeTalk — Project Status

> This file is updated at the end of every development session.
> Start every AI session with: "Read PROJECT_STATUS.md and let's continue."

---

## Last Updated
2026-09-23 — Day 1 complete ✅

## Live URLs
- Frontend (Vercel): _not yet deployed_
- Backend (Render): _not yet deployed_
- MongoDB Atlas: _not yet configured_

---

## Completed ✅
- Core MERN stack chat application
- Real-time messaging via Socket.IO
- Server-side per-recipient translation (app.js lines 106–191)
- Language selection at signup (Login.jsx)
- Language stored in MongoDB User model
- Message "Show original / Show translation" toggle (MessageComponent.jsx)
- File attachments via Cloudinary + multer
- Admin dashboard with Chart.js analytics
- Friend request system
- Group chat creation and management
- **[Day 1]** Removed 265 lines of dead code from Chat.jsx
- **[Day 1]** Removed 85 lines of dead code from app.js
- **[Day 1]** Renamed versel.json → vercel.json (spelling fix)
- **[Day 1]** Created Server/.env.example and Client/.env.example
- **[Day 1]** Created root README.md with architecture, features, badges

---

## In Progress 🔄
- Day 2: Free Deployment (MongoDB Atlas + Render + Vercel)

---

## Next Up 📋
1. Day 2 — Set up MongoDB Atlas M0 free cluster
2. Day 2 — Deploy Server to Render.com (free Node.js web service)
3. Day 2 — Deploy Client to Vercel
4. Day 3 — Fix translation pipeline for historical messages (server-side)

---

## Known Issues / Decisions Made
- `Client/versel.json` is misspelled — must rename to `vercel.json`
- Old messages (loaded from MongoDB) are translated client-side in Chat.jsx via a
  batch useEffect (lines 470–513). This is slow. Fix: translate server-side in getMessages controller.
- Chat.jsx has ~265 lines of commented-out legacy code at the top. Must delete.
- app.js has ~85 lines of commented-out socket code (lines 222–306). Must delete.
- No AI routes exist yet. Target file: Server/routes/ai.js

---

## Architecture — Key Files

| Purpose | File | Notes |
|---|---|---|
| Real-time socket + translation | `Server/app.js` lines 106–191 | Per-recipient translate on NEW_MESSAGE |
| Chat page | `Client/src/pages/Chat.jsx` | Has dead code to remove |
| Message rendering + toggle | `Client/src/components/shared/MessageComponent.jsx` | Already has original/translated toggle |
| Translate API route | `Server/routes/translate.js` | Rate limited, 12 languages |
| User model | `Server/models/user.js` | Has `language` field already |
| Message model | `Server/models/message.js` | Needs `readBy` field for read receipts |
| Header (navbar) | `Client/src/components/layout/Header.jsx` | Needs language picker added |
| AI routes | `Server/routes/ai.js` | **Does not exist yet — to be created** |

---

## 10-Day Roadmap Summary

| Day | Task | Status |
|---|---|---|
| 1 | Foundation & Cleanup | ✅ Done |
| 2 | Free Deployment (Atlas + Render + Vercel) | 🔄 Next |
| 3 | Fix Translation Pipeline (server-side for old messages) | ⬜ |
| 4 | In-app Language Switcher in Header | ⬜ |
| 5 | AI Feature 1: Conversation Summariser (Gemini) | ⬜ |
| 6 | AI Feature 2: Smart Reply Suggestions (Gemini) | ⬜ |
| 7 | AI Feature 3: Voice-to-Text (Web Speech API) | ⬜ |
| 8 | UI/UX Overhaul (dark mode, MUI theme, mobile) | ⬜ |
| 9 | Admin Dashboard Upgrade + Read Receipts | ⬜ |
| 10 | GitHub Portfolio Polish + Final README | ⬜ |

---

## Environment Variables Reference

### Server (.env)
```
MONGO_URI=
PORT=3000
JWT_SECRET=
ADMIN_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_API_KEY=          ← Google Cloud Translate
GEMINI_API_KEY=          ← Google AI Studio (to be added Day 5)
CLIENT_URL=
NODE_ENV=
```

### Client (.env)
```
VITE_SERVER=
```
