import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import {
  MessageOutlined as MessageIcon,
  AutoAwesome as SparkleIcon,
  Translate as TranslateIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const theme    = useTheme();
  const isDark   = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        backgroundImage: isDark
          ? "radial-gradient(circle, rgba(79,70,229,0.06) 1px, transparent 1px)"
          : "radial-gradient(circle, rgba(79,70,229,0.07) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        p: 3,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Stack alignItems="center" spacing={3} sx={{ maxWidth: 480, textAlign: "center" }}>
          {/* Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "24px",
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(79,70,229,0.35)",
            }}
          >
            <MessageIcon sx={{ fontSize: "2.2rem", color: "white" }} />
          </Box>

          {/* Heading */}
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              color="text.primary"
              gutterBottom
            >
              Welcome to GlobeTalk 🌐
            </Typography>
            <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
              Select a conversation from the sidebar to start chatting. Each person reads messages in their own preferred language — automatically.
            </Typography>
          </Box>

          {/* Feature pills */}
          <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center">
            {[
              { icon: <TranslateIcon sx={{ fontSize: "0.85rem" }} />, label: "Auto-translation" },
              { icon: <SparkleIcon sx={{ fontSize: "0.85rem" }} />, label: "AI Summaries" },
              { icon: <SparkleIcon sx={{ fontSize: "0.85rem" }} />, label: "Smart Replies" },
            ].map((pill) => (
              <Stack
                key={pill.label}
                direction="row"
                alignItems="center"
                spacing={0.6}
                sx={{
                  bgcolor: isDark ? "rgba(79,70,229,0.15)" : "rgba(79,70,229,0.08)",
                  border: "1px solid",
                  borderColor: isDark ? "rgba(79,70,229,0.3)" : "rgba(79,70,229,0.2)",
                  borderRadius: 99,
                  px: 1.5,
                  py: 0.5,
                  color: "#7C3AED",
                }}
              >
                {pill.icon}
                <Typography variant="caption" fontWeight={600} sx={{ color: isDark ? "#A5B4FC" : "#4F46E5" }}>
                  {pill.label}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Button
            variant="contained"
            onClick={() => navigate("/groups")}
            sx={{
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              borderRadius: "10px",
              px: 4,
              py: 1.2,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #3730A3 0%, #6D28D9 100%)",
                boxShadow: "0 6px 20px rgba(79,70,229,0.45)",
              },
            }}
          >
            Explore Groups →
          </Button>
        </Stack>
      </motion.div>
    </Box>
  );
};

export default AppLayout()(Home);
