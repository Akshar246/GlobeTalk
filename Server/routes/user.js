import express from "express";
import { login, logout, newUser, searchUser } from "../controllers/user.js";
import {singleAvatar} from "../middlewares/multer.js";
import { getMyProfile } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

// Routes
app.post("/new", singleAvatar, newUser);
app.post("/login", login);

app.use(isAuthenticated);

// After Login user must access the routes
app.get("/me", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);

export default app;