import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { LockOutlined as LockOutlinedIcon, MessageOutlined as MessageOutlinedIcon } from "@mui/icons-material";
import axios from "axios";
import { server } from "../constants/config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const originalLabels = {
  title: "Welcome to GlobeTalk",
  subtitle:
    "Select a chat from the left panel and start messaging. Each person can read in their preferred language.",
  action: "Go to Groups",
  privacy: "Your personal messages stay private and secure.",
};

const Home = () => {
  const navigate = useNavigate();
  const [translated, setTranslated] = useState(originalLabels);
  const preferredLanguage = localStorage.getItem("preferredLanguage") || "en";

  const translateLabels = async () => {
    if (preferredLanguage === "en") {
      setTranslated(originalLabels);
      return;
    }

    try {
      const { data } = await axios.post(`${server}/api/v1/translate`, {
        text: Object.values(originalLabels),
        targetLanguage: preferredLanguage,
      });

      const newTranslated = {};
      Object.keys(originalLabels).forEach((key, idx) => {
        newTranslated[key] = data.translations[idx];
      });

      setTranslated(newTranslated);
    } catch (error) {
      console.error("Home translation error:", error);
      toast.error("Failed to translate homepage");
    }
  };

  useEffect(() => {
    translateLabels();
  }, [preferredLanguage]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f0f2f5",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 620,
          borderRadius: 4,
          border: "1px solid #dde5ee",
          p: { xs: 3, sm: 4 },
          textAlign: "center",
          bgcolor: "#fff",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              bgcolor: "#e9f2ff",
              display: "grid",
              placeItems: "center",
            }}
          >
            <MessageOutlinedIcon sx={{ fontSize: "2rem", color: "#1359a1" }} />
          </Box>

          <Typography
            sx={{
              fontSize: { xs: "1.45rem", sm: "1.7rem" },
              fontWeight: 700,
              color: "#1f2937",
            }}
          >
            {translated.title}
          </Typography>

          <Typography sx={{ color: "#5f6b7a", maxWidth: 520 }}>
            {translated.subtitle}
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/groups")}
            sx={{
              textTransform: "none",
              borderRadius: 99,
              px: 2.5,
              bgcolor: "#1565c0",
              "&:hover": { bgcolor: "#0f4f97" },
            }}
          >
            {translated.action}
          </Button>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ pt: 1 }}>
            <LockOutlinedIcon sx={{ fontSize: "1rem", color: "#6b7280" }} />
            <Typography sx={{ color: "#6b7280", fontSize: "0.88rem" }}>
              {translated.privacy}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AppLayout()(Home);
