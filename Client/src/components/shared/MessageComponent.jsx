import { Box, Button, Typography } from "@mui/material";
import React, { memo, useMemo, useState } from "react";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  const {
    sender,
    content,
    translatedContent,
    originalContent,
    attachments = [],
    createdAt,
  } = message;

  const sameSender = sender?._id === user?._id;
  const [showOriginal, setShowOriginal] = useState(false);

  // Clean time format like 14:30
  const timeAgo = moment(createdAt).format("HH:mm");

  const resolvedOriginal = originalContent || content || "";
  const resolvedTranslated = translatedContent || content || "";

  const hasTranslationToggle = useMemo(
    () =>
      !sameSender &&
      resolvedOriginal &&
      resolvedTranslated &&
      resolvedOriginal !== resolvedTranslated,
    [sameSender, resolvedOriginal, resolvedTranslated]
  );

  const displayContent =
    hasTranslationToggle && showOriginal ? resolvedOriginal : resolvedTranslated;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? "#dcf8c6" : "#ffffff", // WhatsApp Green for sent, White for received
        color: "#111b21",
        borderRadius: sameSender ? "12px 12px 0px 12px" : "12px 12px 12px 0px", // Chat bubble tails
        padding: "0.5rem 0.75rem",
        width: "fit-content",
        maxWidth: "80%",
        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "0.15rem",
      }}
    >
      {/* Sender Name (Only for received messages in group chats) */}
      {!sameSender && (
        <Typography
          variant="caption"
          sx={{ color: "#1976d2", fontWeight: 600, fontSize: "0.75rem", mb: 0.25 }}
        >
          {sender.name}
        </Typography>
      )}

      {/* Attachments */}
      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          return (
            <Box key={index} sx={{ mb: 0.5 }}>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "black" }}>
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}

      {/* Message Text & Timestamp Wrapper */}
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "0.5rem" }}>
        {displayContent && (
          <Typography
            variant="body1"
            sx={{ fontSize: "0.95rem", lineHeight: 1.4, wordBreak: "break-word" }}
          >
            {displayContent}
          </Typography>
        )}

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            color: "#667781",
            fontSize: "0.65rem",
            marginLeft: "auto", // Pushes timestamp to the right corner
            position: "relative",
            top: "4px",
            lineHeight: 1,
          }}
        >
          {timeAgo}
        </Typography>
      </Box>

      {/* Translation Toggle Button */}
      {hasTranslationToggle && (
        <Button
          size="small"
          onClick={() => setShowOriginal((prev) => !prev)}
          sx={{
            minWidth: "unset",
            p: 0,
            textTransform: "none",
            fontSize: "0.75rem",
            color: "#027eb5",
            alignSelf: "flex-start",
            mt: 0.5,
          }}
        >
          {showOriginal ? "Show translation" : "Show original"}
        </Button>
      )}
    </motion.div>
  );
};

export default memo(MessageComponent);
