import { Box, Button, Typography } from "@mui/material";
import React, { memo, useMemo, useState } from "react";
import { lightBlue } from "../../constants/color";
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

  const timeAgo = moment(createdAt).fromNow();
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
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant="caption">
          {sender.name}
        </Typography>
      )}

      {displayContent && <Typography>{displayContent}</Typography>}

      {hasTranslationToggle && (
        <Button
          size="small"
          onClick={() => setShowOriginal((prev) => !prev)}
          sx={{
            minWidth: "unset",
            px: 0,
            textTransform: "none",
            fontSize: "0.72rem",
            mt: 0.5,
            color: "#1565c0",
          }}
        >
          {showOriginal ? "Show translation" : "Show original"}
        </Button>
      )}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={index}>
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: "black",
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}

      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
