import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { summariseChat, smartReply } from "../controllers/ai.js";

const app = express.Router();

// All AI routes require login
app.use(isAuthenticated);

app.post("/summarise", summariseChat);   // Gemini conversation summary
app.post("/smartreply", smartReply);     // Gemini smart reply suggestions

export default app;
