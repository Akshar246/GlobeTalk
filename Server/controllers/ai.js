import { GoogleGenAI } from "@google/genai";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";

// ── Gemini client (new unified SDK) ─────────────────────────────────────────
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Model preference list — tried in order if one is overloaded
const MODEL_PREFERENCE = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.5-flash-lite",
];

// ── Retry helper with exponential backoff ────────────────────────────────────
// Handles 503 (overloaded) and 429 (rate limit) gracefully
const retryWithBackoff = async (fn, retries = 3, baseDelay = 1500) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRetryable =
        err?.status === 503 || err?.status === 429 ||
        err?.message?.includes("503") || err?.message?.includes("overloaded") ||
        err?.message?.includes("high demand");

      if (!isRetryable || attempt === retries - 1) throw err;

      // Exponential backoff + jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500;
      console.log(`Gemini attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// ── Try each model in preference list ────────────────────────────────────────
const generateWithFallback = async (prompt) => {
  let lastError;
  for (const modelName of MODEL_PREFERENCE) {
    try {
      const result = await retryWithBackoff(() =>
        ai.models.generateContent({
          model: modelName,
          contents: prompt,
        })
      );
      return result.text;
    } catch (err) {
      console.error(`Model ${modelName} failed:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError;
};

// ── POST /api/v1/ai/summarise ────────────────────────────────────────────────
const summariseChat = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  if (!chatId) return next(new ErrorHandler("chatId is required", 400));

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.members.includes(req.user.toString()))
    return next(new ErrorHandler("Access denied", 403));

  const messages = await Message.find({ chat: chatId })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("sender", "name")
    .lean();

  if (!messages.length)
    return next(new ErrorHandler("No messages to summarise yet", 400));

  const chronological = messages.reverse();
  const transcript = chronological
    .map((m) => `${m.sender.name}: ${m.content || "[attachment]"}`)
    .join("\n");

  const prompt = `You are a helpful assistant that summarises chat conversations.

Here is a conversation transcript:
${transcript}

Provide a concise summary in 3-5 bullet points.
- Focus on key topics discussed and any decisions or action items
- Keep each bullet to one short sentence
- Use plain language, no markdown headers
- Start each bullet with "•"`;

  const summary = await generateWithFallback(prompt);

  return res.status(200).json({
    success: true,
    summary,
    messageCount: chronological.length,
  });
});

// ── POST /api/v1/ai/smartreply ───────────────────────────────────────────────
const smartReply = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  if (!chatId) return next(new ErrorHandler("chatId is required", 400));

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.members.includes(req.user.toString()))
    return next(new ErrorHandler("Access denied", 403));

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
- Short replies are fine (e.g. "Sounds good!", "On my way!", "Let me check")
- Return ONLY the 3 replies, one per line, no numbering, no bullets, no extra text`;

  const raw = await generateWithFallback(prompt);
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
