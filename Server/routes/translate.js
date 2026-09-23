// routes/translate.js
import express from "express";
import { Translate } from "@google-cloud/translate/build/src/v2/index.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const translator = new Translate({
  key: process.env.GOOGLE_API_KEY,
});

const REQUEST_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_TEXT_LENGTH = 1000;
const MAX_BATCH_SIZE = 30;
const requestStore = new Map();

const supportedLanguages = new Set([
  "en",
  "fr",
  "es",
  "de",
  "it",
  "hi",
  "ja",
  "ko",
  "zh",
  "ar",
  "pt",
  "ru",
]);

const getClientIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
  req.ip ||
  "unknown";

const translateRateLimiter = (req, res, next) => {
  const clientIp = getClientIp(req);
  const now = Date.now();
  const existing = requestStore.get(clientIp);

  if (!existing || now - existing.windowStart > REQUEST_WINDOW_MS) {
    requestStore.set(clientIp, { count: 1, windowStart: now });
    return next();
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: "Too many translation requests. Please try again shortly.",
    });
  }

  existing.count += 1;
  return next();
};

const validateTranslateBody = (req, res, next) => {
  const { text, targetLanguage } = req.body;

  if (!targetLanguage || !supportedLanguages.has(targetLanguage)) {
    return res.status(400).json({
      success: false,
      message: "Invalid target language.",
    });
  }

  if (typeof text === "string") {
    if (!text.trim() || text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: "Invalid text payload.",
      });
    }
    return next();
  }

  if (Array.isArray(text)) {
    if (text.length === 0 || text.length > MAX_BATCH_SIZE) {
      return res.status(400).json({
        success: false,
        message: "Invalid text batch size.",
      });
    }

    const invalidEntry = text.some(
      (entry) =>
        typeof entry !== "string" ||
        !entry.trim() ||
        entry.length > MAX_TEXT_LENGTH
    );

    if (invalidEntry) {
      return res.status(400).json({
        success: false,
        message: "Invalid text entry in batch.",
      });
    }

    return next();
  }

  return res.status(400).json({
    success: false,
    message: "Text must be a string or an array of strings.",
  });
};

router.post("/", translateRateLimiter, validateTranslateBody, async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Translation service is not configured.",
    });
  }

  try {
    const [translations] = await translator.translate(text, targetLanguage);
    res.json({
      success: true,
      translations: Array.isArray(translations) ? translations : [translations],
    });
  } catch (error) {
    console.error("Translation error:", error.message);
    res.status(500).json({
      success: false,
      message: "Translation failed.",
    });
  }
});

export default router;
