import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
  updateLanguage,
} from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { getMyProfile } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
} from "../lib/validators.js";

const app = express.Router();

// Public routes
app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);

// Protected routes (login required)
app.use(isAuthenticated);

app.get("/me", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);
app.put("/sendRequest", sendRequestValidator(), validateHandler, sendFriendRequest);
app.put("/acceptRequest", acceptRequestValidator(), validateHandler, acceptFriendRequest);
app.get("/notifications", getMyNotifications);
app.get("/friends", getMyFriends);
app.patch("/language", updateLanguage);  // Day 4: in-app language switcher

export default app;