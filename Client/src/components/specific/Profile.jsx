import React from "react";
import { Avatar, Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import moment from "moment";
import { transformImage } from "../../lib/features";

const Profile = ({ user }) => {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Stack spacing={3} direction="column" alignItems="center" width="100%">
      {/* Avatar with gradient ring */}
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            width: 116,
            height: 116,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: "3px",
          }}
        >
          <Avatar
            src={transformImage(user?.avatar?.url)}
            sx={{
              width: 110,
              height: 110,
              border: `3px solid ${isDark ? "#1A1B2E" : "#FFFFFF"}`,
            }}
          />
        </Box>
        {/* Online dot */}
        <Box
          sx={{
            position: "absolute",
            bottom: 6,
            right: 6,
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "#10B981",
            border: `2.5px solid ${isDark ? "#1A1B2E" : "#FFFFFF"}`,
          }}
        />
      </Box>

      {/* Name */}
      <Stack alignItems="center" spacing={0.25}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: isDark ? "#F1F0FF" : "#111827" }}
        >
          {user?.name}
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? "#8B8FA8" : "#6B7280" }}>
          @{user?.username}
        </Typography>
      </Stack>

      {/* Bio chip */}
      {user?.bio && (
        <Box
          sx={{
            bgcolor: isDark ? "rgba(79,70,229,0.15)" : "rgba(79,70,229,0.08)",
            border: "1px solid",
            borderColor: isDark ? "rgba(79,70,229,0.3)" : "rgba(79,70,229,0.2)",
            borderRadius: 3,
            px: 2,
            py: 1,
            textAlign: "center",
            maxWidth: "100%",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: isDark ? "#A5B4FC" : "#4F46E5", fontStyle: "italic", fontSize: "0.82rem" }}
          >
            "{user?.bio}"
          </Typography>
        </Box>
      )}

      <Divider sx={{ width: "100%", borderColor: isDark ? "#2D2F4A" : "#E5E7EB" }} />

      {/* Info rows */}
      <Stack spacing={1.5} width="100%">
        <ProfileRow
          icon={<UserNameIcon />}
          label="Username"
          value={`@${user?.username}`}
          isDark={isDark}
        />
        <ProfileRow
          icon={<CalendarIcon />}
          label="Joined"
          value={moment(user?.createdAt).fromNow()}
          isDark={isDark}
        />
      </Stack>
    </Stack>
  );
};

const ProfileRow = ({ icon, label, value, isDark }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={1.5}
    sx={{
      bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(79,70,229,0.04)",
      borderRadius: 2.5,
      px: 2,
      py: 1.25,
    }}
  >
    <Box sx={{ color: "#7C3AED", display: "flex", flexShrink: 0 }}>{icon}</Box>
    <Stack>
      <Typography variant="caption" sx={{ color: isDark ? "#8B8FA8" : "#9CA3AF", lineHeight: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ color: isDark ? "#F1F0FF" : "#111827" }}>
        {value}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;