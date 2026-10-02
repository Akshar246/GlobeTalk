import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { memo, useMemo, useState } from "react";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user, isSeen }) => {

  const {
    sender,
    content,
    translatedContent,
    originalContent,
    attachments = [],
    createdAt,
  } = message;

  const theme     = useTheme();
  const isDark    = theme.palette.mode === "dark";
  const sameSender = sender?._id === user?._id;

  const [showOriginal, setShowOriginal] = useState(false);
  const timeAgo = moment(createdAt).format("HH:mm");

  const resolvedOriginal   = originalContent || content || "";
  const resolvedTranslated = translatedContent || content || "";

  const hasTranslationToggle = useMemo(
    () =>
      !sameSender &&
      resolvedOriginal &&
      resolvedTranslated &&
      resolvedOriginal !== resolvedTranslated,
    [sameSender, resolvedOriginal, resolvedTranslated]
  );

  const displayContent = hasTranslationToggle && showOriginal
    ? resolvedOriginal
    : resolvedTranslated;

  // ── Bubble styles ────────────────────────────────────────────────────────────
  const sentBg   = "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)";
  const recvBg   = isDark ? "#1E2140" : "#FFFFFF";
  const sentText = "#FFFFFF";
  const recvText = isDark ? "#F1F0FF" : "#111827";
  const sentShadow = "0 4px 15px rgba(79,70,229,0.35)";
  const recvShadow = isDark
    ? "0 2px 8px rgba(0,0,0,0.4)"
    : "0 2px 8px rgba(0,0,0,0.08)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        maxWidth: "72%",
        display: "flex",
        flexDirection: "column",
        alignItems: sameSender ? "flex-end" : "flex-start",
      }}
    >
      {/* Sender label for group chats */}
      {!sameSender && (
        <Typography
          variant="caption"
          sx={{
            color: "#7C3AED",
            fontWeight: 700,
            fontSize: "0.72rem",
            ml: 1.5,
            mb: 0.3,
          }}
        >
          {sender.name}
        </Typography>
      )}

      {/* The bubble */}
      <Box
        sx={{
          background: sameSender ? sentBg : recvBg,
          color: sameSender ? sentText : recvText,
          borderRadius: sameSender ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          px: 2,
          py: 1.25,
          boxShadow: sameSender ? sentShadow : recvShadow,
          position: "relative",
        }}
      >
        {/* Attachments */}
        {attachments.length > 0 &&
          attachments.map((attachment, index) => {
            const url  = attachment.url;
            const file = fileFormat(url);
            return (
              <Box key={index} sx={{ mb: content ? 1 : 0 }}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: sameSender ? "white" : "inherit" }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })}

        {/* Text + timestamp row */}
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "0.4rem" }}>
          {displayContent && (
            <Typography
              variant="body2"
              sx={{ fontSize: "0.93rem", lineHeight: 1.5, wordBreak: "break-word" }}
            >
              {displayContent}
            </Typography>
          )}

          {/* Timestamp + read receipt ticks */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "2px", marginLeft: "auto", position: "relative", top: "2px" }}>
            <Typography
              variant="caption"
              sx={{ fontSize: "0.65rem", opacity: 0.7, lineHeight: 1, whiteSpace: "nowrap" }}
            >
              {timeAgo}
            </Typography>

            {/* Only show ticks for our own sent messages */}
            {sameSender && (
              <Typography
                component="span"
                sx={{
                  fontSize: "0.75rem",
                  lineHeight: 1,
                  letterSpacing: "-2px",
                  // ✓✓ = indigo (read), ✓ = semi-transparent white (delivered)
                  color: isSeen ? "#A5F3FC" : "rgba(255,255,255,0.6)",
                  transition: "color 0.4s ease",
                  fontWeight: 700,
                }}
              >
                {isSeen ? "✓✓" : "✓"}
              </Typography>
            )}
          </Box>
        </Box>


        {/* Translation toggle */}
        {hasTranslationToggle && (
          <Button
            size="small"
            onClick={() => setShowOriginal((p) => !p)}
            sx={{
              minWidth: "unset",
              p: 0,
              mt: 0.5,
              textTransform: "none",
              fontSize: "0.72rem",
              color: isDark ? "#A5B4FC" : "#4F46E5",
              fontWeight: 600,
              alignSelf: "flex-start",
            }}
          >
            {showOriginal ? "Show translation ↩" : "Show original ↪"}
          </Button>
        )}
      </Box>
    </motion.div>
  );
};

export default memo(MessageComponent);
