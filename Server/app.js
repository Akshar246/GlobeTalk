import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";
import translateRoute from "./routes/translate.js";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";
import { User } from "./models/user.js";
import { Translate } from "@google-cloud/translate/build/src/v2/index.js";

const translate = new Translate({ key: process.env.GOOGLE_API_KEY });

dotenv.config({
  path: "./.env",
});
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "AmitSoni246";
const userSocketIDs = new Map();
const onlineUsers = new Set();


// Database connection
connectDB(mongoURI);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

// Cookie Parser
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);
// Using middleware here
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/translate", translateRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.response, async (err) =>
    await socketAuthenticator(err, socket, next)
  );
});

io.on("connection", (socket) => {
  const user = socket.user;

  userSocketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const chatMembers = await User.find({ _id: { $in: members } });

    for (const member of chatMembers) {
      let finalMessage = message;

      if (member._id.toString() !== user._id.toString()) {
        if (member.language && member.language !== user.language) {
          try {
            const [translatedText] = await translate.translate(
              message,
              member.language
            );
            finalMessage = translatedText;
          } catch (e) {
            console.log("Translation Error:", e);
          }
        }

        const socketId = userSocketIDs.get(member._id.toString());
        if (socketId) {
          io.to(socketId).emit(NEW_MESSAGE, {
            chatId,
            message: {
              content: finalMessage,
              _id: uuid(),
              sender: {
                _id: user._id,
                name: user.name,
              },
              chat: chatId,
              createdAt: new Date().toISOString(),
            },
          });

          io.to(socketId).emit(NEW_MESSAGE_ALERT, { chatId });
        }
      }
    }

    try {
      await Message.create(messageForDB); // Store original message
    } catch (error) {
      console.log("Message DB Error:", error);
    }
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString());
    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());
    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});


// io.on("connection", (socket) => {
//   const user = socket.user;

//   userSocketIDs.set(user._id.toString(), socket.id);

//   socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
//     const messageForDB = {
//       content: message,
//       sender: user._id,
//       chat: chatId,
//     };

//     const chatMembers = await User.find({ _id: { $in: members } });

//     for (const member of chatMembers) {
//       let finalMessage = message;

//       if (member.language && member.language !== user.language) {
//         try {
//           const [translatedText] = await translate.translate(
//             message,
//             member.language
//           );
//           finalMessage = translatedText;
//         } catch (e) {
//           console.log("Translation Error:", e);
//         }
//       }

//       const socketId = userSocketIDs.get(member._id.toString());
//       if (socketId) {
//         io.to(socketId).emit(NEW_MESSAGE, {
//           chatId,
//           message: {
//             content: finalMessage,
//             _id: uuid(),
//             sender: {
//               _id: user._id,
//               name: user.name,
//             },
//             chat: chatId,
//             createdAt: new Date().toISOString(),
//           },
//         });

//         io.to(socketId).emit(NEW_MESSAGE_ALERT, { chatId });
//       }
//     }

//     try {
//       await Message.create(messageForDB);
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   socket.on(START_TYPING, ({ members, chatId }) => {
//     const membersSockets = getSockets(members);
//     socket.to(membersSockets).emit(START_TYPING, { chatId });
//   });

//   socket.on(STOP_TYPING, ({ members, chatId }) => {
//     const membersSockets = getSockets(members);
//     socket.to(membersSockets).emit(STOP_TYPING, { chatId });
//   });

//   socket.on(CHAT_JOINED, ({ userId, members }) => {
//     onlineUsers.add(userId.toString());
//     const membersSocket = getSockets(members);
//     io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
//   });

//   socket.on(CHAT_LEAVED, ({ userId, members }) => {
//     onlineUsers.delete(userId.toString());
//     const membersSocket = getSockets(members);
//     io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
//   });

//   socket.on("disconnect", () => {
//     userSocketIDs.delete(user._id.toString());
//     onlineUsers.delete(user._id.toString());
//     socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
//   });
// });

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${envMode} Mode`);
});

export { adminSecretKey, envMode, userSocketIDs };