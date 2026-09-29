import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Active state colours
  const activeBg    = isDark
    ? "linear-gradient(135deg, rgba(79,70,229,0.35) 0%, rgba(124,58,237,0.2) 100%)"
    : "linear-gradient(135deg, rgba(79,70,229,0.1) 0%, rgba(124,58,237,0.06) 100%)";
  const activeLeft  = "3px solid #4F46E5";
  const hoverBg     = isDark ? "rgba(255,255,255,0.04)" : "rgba(79,70,229,0.05)";
  const textColor   = isDark ? "#F1F0FF" : "#111827";
  const subColor    = isDark ? "#8B8FA8" : "#6B7280";

  return (
    <Link
      to={`/chat/${_id}`}
      sx={{ padding: "0", textDecoration: "none" }}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.04, duration: 0.25 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          background: sameSender ? activeBg : "transparent",
          borderLeft: sameSender ? activeLeft : "3px solid transparent",
          padding: "0.75rem 1rem",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.15s ease",
        }}
        whileHover={{ background: sameSender ? activeBg : hoverBg }}
      >
        {/* Avatar */}
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <AvatarCard avatar={avatar} />
          {/* Online indicator */}
          {isOnline && (
            <Box
              sx={{
                position: "absolute",
                bottom: 1,
                right: 1,
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "#10B981",
                border: `2px solid ${isDark ? "#14152A" : "#FFFFFF"}`,
              }}
            />
          )}
        </Box>

        {/* Name + preview */}
        <Stack sx={{ overflow: "hidden", flex: 1 }} spacing={0.25}>
          <Typography
            variant="body2"
            fontWeight={sameSender ? 700 : 500}
            noWrap
            sx={{ color: textColor, fontSize: "0.92rem" }}
          >
            {name}
          </Typography>

          {newMessageAlert && (
            <Typography
              variant="caption"
              noWrap
              sx={{
                color: "#4F46E5",
                fontWeight: 600,
                fontSize: "0.72rem",
              }}
            >
              {newMessageAlert.count} new {newMessageAlert.count === 1 ? "message" : "messages"}
            </Typography>
          )}
        </Stack>

        {/* Unread badge */}
        {newMessageAlert && (
          <Box
            sx={{
              minWidth: 20,
              height: 20,
              borderRadius: 99,
              bgcolor: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Typography sx={{ color: "#fff", fontSize: "0.65rem", fontWeight: 700 }}>
              {newMessageAlert.count}
            </Typography>
          </Box>
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);