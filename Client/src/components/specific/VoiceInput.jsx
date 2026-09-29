import React, { useState, useRef, useCallback } from "react";
import { IconButton, Tooltip, Box, Typography, useTheme } from "@mui/material";
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// ── Language code → Web Speech API BCP-47 locale ───────────────────────────
const LANG_TO_LOCALE = {
  en: "en-US",
  hi: "hi-IN",
  fr: "fr-FR",
  es: "es-ES",
  de: "de-DE",
  it: "it-IT",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
  ar: "ar-SA",
  pt: "pt-PT",
  ru: "ru-RU",
};

// ── VoiceInput ─────────────────────────────────────────────────────────────
// Press the mic button → speak → transcript fills the message input.
// Uses the browser-native Web Speech API — zero cost, works in Chrome/Edge.
const VoiceInput = ({ onResult }) => {
  const theme     = useTheme();
  const isDark    = theme.palette.mode === "dark";
  const [listening, setListening]   = useState(false);
  const [supported]                 = useState(
    () => !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    if (listening) {
      // Toggle off
      recognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Voice input not supported in this browser. Use Chrome or Edge.");
      return;
    }

    const preferredLang = localStorage.getItem("preferredLanguage") || "en";
    const locale        = LANG_TO_LOCALE[preferredLang] || "en-US";

    const recognition = new SpeechRecognition();
    recognition.lang             = locale;
    recognition.continuous       = false;
    recognition.interimResults   = false;
    recognition.maxAlternatives  = 1;

    recognition.onstart = () => {
      setListening(true);
      toast("Listening… speak now 🎙️", {
        id:       "voice-input",
        duration: 8000,
        icon:     "🎙️",
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      toast.success(`Transcribed: "${transcript}"`, { id: "voice-input" });
    };

    recognition.onerror = (event) => {
      const msg =
        event.error === "no-speech"   ? "No speech detected — try again."   :
        event.error === "not-allowed" ? "Microphone access denied. Allow mic in browser settings." :
        `Voice error: ${event.error}`;
      toast.error(msg, { id: "voice-input" });
    };

    recognition.onend = () => {
      setListening(false);
      toast.dismiss("voice-input");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [listening, onResult]);

  // Don't render at all on unsupported browsers
  if (!supported) return null;

  return (
    <Tooltip title={listening ? "Tap to stop" : "Voice input"}>
      <Box sx={{ position: "relative" }}>
        {/* Pulse ring when listening */}
        <AnimatePresence>
          {listening && (
            <motion.div
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
              style={{
                position:     "absolute",
                inset:        0,
                borderRadius: "50%",
                background:   "rgba(239,68,68,0.4)",
                pointerEvents: "none",
              }}
            />
          )}
        </AnimatePresence>

        <IconButton
          onClick={startListening}
          size="small"
          sx={{
            width:      40,
            height:     40,
            bgcolor:    listening
              ? "rgba(239,68,68,0.15)"
              : isDark ? "rgba(255,255,255,0.05)" : "rgba(79,70,229,0.07)",
            border:     "1.5px solid",
            borderColor: listening
              ? "rgba(239,68,68,0.5)"
              : isDark ? "#2D2F4A" : "#E5E7EB",
            color:      listening ? "#EF4444" : "#7C3AED",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: listening
                ? "rgba(239,68,68,0.22)"
                : isDark ? "rgba(255,255,255,0.1)" : "rgba(79,70,229,0.12)",
            },
          }}
        >
          {listening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ display: "flex" }}
            >
              <MicIcon sx={{ fontSize: "1.15rem" }} />
            </motion.div>
          ) : (
            <MicIcon sx={{ fontSize: "1.15rem" }} />
          )}
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default VoiceInput;
