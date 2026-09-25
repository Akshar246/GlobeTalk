import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

// ── POST /api/v1/ai/summarise ────────────────────────────────────────────────
// Takes the last 50 messages from a chat and returns a Gemini-generated summary
const summariseChat = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;

  if (!chatId) return next(new ErrorHandler("chatId is required", 400));

  // Verify user is a member of this chat
  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.members.includes(req.user.toString()))
    return next(new ErrorHandler("Access denied", 403));

  // Fetch last 50 messages, newest first, then reverse for chronological order
  const messages = await Message.find({ chat: chatId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("sender", "name")
    .lean();

  if (!messages.length)
    return next(new ErrorHandler("No messages to summarise", 400));

  const chronological = messages.reverse();

  // Build a readable transcript for Gemini
  const transcript = chronological
    .map((m) => `${m.sender.name}: ${m.content || "[attachment]"}`)
    .join("\n");

  const prompt = `You are a helpful assistant that summarises chat conversations.

Here is a conversation transcript:
${transcript}

Please provide a concise summary of this conversation in 3-5 bullet points.
- Focus on the key topics discussed and any decisions or action items
- Keep each bullet point to one short sentence
- Use plain language, no markdown headers
- Start each bullet with "•"`;

  const result = await model.generateContent(prompt);
  const summary = result.response.text();

  return res.status(200).json({
    success: true,
    summary,
    messageCount: chronological.length,
  });
});

// ── POST /api/v1/ai/smartreply ───────────────────────────────────────────────
// Suggests 3 short smart replies based on the last few messages
const smartReply = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;

  if (!chatId) return next(new ErrorHandler("chatId is required", 400));

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.members.includes(req.user.toString()))
    return next(new ErrorHandler("Access denied", 403));

  // Only need the last 10 messages for context
  const messages = await Message.find({ chat: chatId })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("sender", "name")
    .lean();

  if (!messages.length)
    return next(new ErrorHandler("No messages to base replies on", 400));

  const chronological = messages.reverse();

  const transcript = chronological
    .map((m) => `${m.sender.name}: ${m.content || "[attachment]"}`)
    .join("\n");

  const prompt = `You are a smart reply generator for a chat application.

Based on this recent conversation:
${transcript}

Generate exactly 3 short, natural reply suggestions that the reader could send next.
Rules:
- Each reply must be under 8 words
- One word or very short replies are fine (e.g. "Sounds good!", "On my way!", "Let me check")
- Return ONLY the 3 replies, one per line, no numbering, no bullets, no extra text`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  // Parse the 3 lines into an array
  const replies = raw
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean)
    .slice(0, 3);

  return res.status(200).json({
    success: true,
    replies,
  });
});

export { summariseChat, smartReply };
