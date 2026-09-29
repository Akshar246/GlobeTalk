import React, { useState } from "react";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Button,
  Divider,
  Paper,
  TextField,
  Grid,
  Skeleton,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import moment from "moment";
import AppLayout from "../components/layout/AppLayout";
import { useAvailableFriendsQuery } from "../redux/api/api";
import { transformImage } from "../lib/features";

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, delay }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
      style={{ flex: 1, minWidth: 120 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 3,
          textAlign: "center",
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: isDark
              ? "0 8px 32px rgba(79,70,229,0.2)"
              : "0 8px 32px rgba(79,70,229,0.12)",
          },
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 1.25,
            color: "white",
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h6"
          fontWeight={700}
          color="text.primary"
          sx={{ fontSize: { xs: "1rem", sm: "1.15rem" } }}
        >
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Paper>
    </motion.div>
  );
};

// ── Friend Row ────────────────────────────────────────────────────────────────
const FriendRow = ({ friend, index }) => {
  const theme = useTheme();

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index * 0.05}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          p: 1.5,
          borderRadius: 2.5,
          transition: "background 0.15s",
          "&:hover": {
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(79,70,229,0.08)"
                : "rgba(79,70,229,0.05)",
          },
        }}
      >
        <Avatar
          src={transformImage(friend.avatar?.url || "", 64)}
          alt={friend.name}
          sx={{
            width: 46,
            height: 46,
            border: "2px solid",
            borderColor: "primary.main",
          }}
        >
          {friend.name?.[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {friend.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            @{friend.username}
          </Typography>
        </Box>
      </Stack>
    </motion.div>
  );
};

// ── Profile Page ──────────────────────────────────────────────────────────────
const ProfilePage = ({ user }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [editName, setEditName] = useState(user?.name || "");
  const [editBio, setEditBio] = useState(user?.bio || "");

  const { data: friendsData, isLoading: friendsLoading } =
    useAvailableFriendsQuery();

  const friends = friendsData?.friends || [];

  const handleSave = () => {
    toast("Profile update coming soon! 🚀", {
      icon: "✨",
      style: {
        borderRadius: "12px",
        background: isDark ? "#1A1B2E" : "#fff",
        color: isDark ? "#F1F0FF" : "#111827",
        border: `1px solid ${isDark ? "#2D2F4A" : "#E5E7EB"}`,
      },
    });
  };

  if (!user) return null;

  const avatarUrl = user.avatar?.url
    ? transformImage(user.avatar.url, 200)
    : "";
  const memberSince = user.createdAt
    ? moment(user.createdAt).format("MMM YYYY")
    : "—";
  const language = user.language
    ? user.language.charAt(0).toUpperCase() + user.language.slice(1)
    : "English";

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: "background.default",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 160, sm: 200, md: 220 },
          background:
            "linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #F59E0B 130%)",
          overflow: "visible",
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -40,
            left: "10%",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />

        {/* Avatar — overlaps banner bottom */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          style={{
            position: "absolute",
            bottom: -75,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              p: "4px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #4F46E5, #7C3AED, #F59E0B)",
              boxShadow: isDark
                ? "0 8px 32px rgba(79,70,229,0.55)"
                : "0 8px 32px rgba(79,70,229,0.35)",
            }}
          >
            <Avatar
              src={avatarUrl}
              alt={user.name}
              sx={{
                width: 150,
                height: 150,
                fontSize: "3.5rem",
                fontWeight: 700,
                bgcolor: isDark ? "#1A1B2E" : "#F5F6FA",
                color: "primary.main",
                border: `4px solid ${isDark ? "#1A1B2E" : "#ffffff"}`,
              }}
            >
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
          </Box>
        </motion.div>
      </Box>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          maxWidth: 780,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pb: 6,
        }}
      >
        {/* Space for avatar overlap */}
        <Box sx={{ height: 90 }} />

        {/* ── Identity ───────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <Stack alignItems="center" spacing={0.75} mb={0.5}>
            <Typography
              variant="h4"
              fontWeight={800}
              color="text.primary"
              textAlign="center"
            >
              {user.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              fontWeight={500}
            >
              @{user.username}
            </Typography>
            {user.bio && (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ maxWidth: 480, mt: 0.5, lineHeight: 1.6 }}
              >
                {user.bio}
              </Typography>
            )}
          </Stack>
        </motion.div>

        {/* ── Stats Row ──────────────────────────────────────────────────── */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 3.5, mb: 4 }}
        >
          <StatCard
            icon={<PeopleIcon fontSize="small" />}
            label="Friends"
            value={friendsLoading ? "—" : friends.length}
            delay={0.1}
          />
          <StatCard
            icon={<CalendarIcon fontSize="small" />}
            label="Member Since"
            value={memberSince}
            delay={0.2}
          />
          <StatCard
            icon={<LanguageIcon fontSize="small" />}
            label="Language"
            value={language}
            delay={0.3}
          />
        </Stack>

        <Divider sx={{ mb: 4, borderColor: "divider" }} />

        {/* ── Edit Profile ───────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: "background.paper",
              mb: 4,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              mb={2.5}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <EditIcon fontSize="small" />
              </Box>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                Edit Profile
              </Typography>
            </Stack>

            <Stack spacing={2.5}>
              <TextField
                label="Display Name"
                fullWidth
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <PersonIcon
                      sx={{ mr: 1, color: "text.secondary", fontSize: "1.1rem" }}
                    />
                  ),
                }}
              />
              <TextField
                label="Bio"
                fullWidth
                multiline
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                variant="outlined"
                placeholder="Tell the world a little about yourself…"
                inputProps={{ maxLength: 200 }}
                helperText={`${editBio.length}/200`}
              />
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                    px: 4,
                    py: 1.25,
                    borderRadius: 2.5,
                    fontSize: "0.95rem",
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Stack>
          </Paper>
        </motion.div>

        {/* ── Friends List ───────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: "background.paper",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  <PeopleIcon fontSize="small" />
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="text.primary"
                >
                  Your Friends
                </Typography>
              </Stack>

              {!friendsLoading && (
                <Chip
                  label={friends.length}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                    color: "white",
                    fontSize: "0.78rem",
                  }}
                />
              )}
            </Stack>

            {friendsLoading ? (
              <Stack spacing={1.5}>
                {[1, 2, 3].map((i) => (
                  <Stack
                    key={i}
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    p={1}
                  >
                    <Skeleton variant="circular" width={46} height={46} />
                    <Box flex={1}>
                      <Skeleton width="40%" height={16} />
                      <Skeleton width="25%" height={12} sx={{ mt: 0.5 }} />
                    </Box>
                  </Stack>
                ))}
              </Stack>
            ) : friends.length === 0 ? (
              <Stack alignItems="center" spacing={1} py={3}>
                <PeopleIcon
                  sx={{ fontSize: 48, color: "text.secondary", opacity: 0.4 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  No friends yet. Start by searching for people!
                </Typography>
              </Stack>
            ) : (
              <Stack divider={<Divider sx={{ borderColor: "divider" }} />}>
                {friends.map((friend, idx) => (
                  <FriendRow key={friend._id} friend={friend} index={idx} />
                ))}
              </Stack>
            )}
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AppLayout()(ProfilePage);
