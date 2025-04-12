// routes/translate.js
import express from "express";
import { Translate } from "@google-cloud/translate/build/src/v2/index.js";

import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const translator = new Translate({
  key: process.env.GOOGLE_API_KEY,
});

router.post("/", async (req, res) => {
  const { text, targetLanguage } = req.body;

  try {
    const [translations] = await translator.translate(text, targetLanguage);
    res.json({
      translations: Array.isArray(translations) ? translations : [translations],
    });
  } catch (error) {
    console.error("Translation error:", error.message);
    res.status(500).json({ error: "Translation failed." });
  }
});

export default router;
