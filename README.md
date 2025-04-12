
# 🌐 GlobeTalk – Real-Time Multilingual Chat Application

GlobeTalk is a full-stack web application that enables real-time chat between users across the globe — with **automatic language translation**. Users can chat in their preferred language, and messages are **instantly translated** into the recipient’s native language.

Built using the **MERN stack** and powered by the **Google Cloud Translation API**.

---

## 🚀 Features

- 🔐 **Authentication** – Secure login/signup with profile avatar upload
- 🌍 **Language Selector** – Choose preferred language before login
- 📩 **Real-Time Messaging** – Built using **Socket.IO**
- 🗣️ **Live Translations** – Messages auto-translated based on user’s language
- 👥 **One-to-One & Group Chats**
- 🌙 **Responsive UI** – Built with **Material UI** for modern design
- ☁️ **Cloud Storage** – Avatar uploads via **Cloudinary**
- 🧠 **User Preferences** – Stored in MongoDB & used across sessions

---

## 🧱 Tech Stack

| Frontend              | Backend              | Utilities                     |
|-----------------------|----------------------|-------------------------------|
| React + Vite          | Node.js + Express    | Socket.IO (Real-Time Chat)    |
| Redux Toolkit         | MongoDB + Mongoose   | Google Cloud Translation API  |
| Material UI (MUI)     | Cloudinary (Avatar)  | JWT (Auth), Bcrypt (Security) |

---

## 🧪 How It Works

1. 🌐 User selects a language from the dropdown
2. 📝 Registers with a name, username, bio, password & avatar
3. 🧠 Preferred language is saved in MongoDB + localStorage
4. 💬 When chatting:
   - Sender writes in **any language**
   - Receiver gets it **auto-translated** in their own language
5. ✅ Real-time experience via Socket.IO

---

## 📁 Folder Structure

```
GlobeTalkApp/
├── Client/       # React Frontend
├── Server/       # Express Backend
└── .gitignore    # Ignores node_modules, envs, etc.
```

---

## 🔒 Environment Variables

Create a `.env` file in `/Server`:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ADMIN_SECRET_KEY=admin_key
GOOGLE_API_KEY=your_google_translate_api_key

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLIENT_URL=http://localhost:5173
```

## 📦 Installation

1. **Clone the repo**

```bash
git clone https://github.com/Akshar246/GlobeTalk.git
cd GlobeTalkApp
```

2. **Install dependencies**

```bash
cd Client && npm install
cd ../Server && npm install
```

3. **Run locally**

```bash
# Start backend
cd Server
npm run dev

# Start frontend
cd ../Client
npm run dev
```

---

## 🙌 Author

Made with ❤️ by **Akshar Chanchlani**

---

## 📄 License

This project is licensed under the MIT License.
