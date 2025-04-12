import React, { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography, Stack } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import axios from "axios";
import { server } from "../constants/config";
import toast from "react-hot-toast";

const originalLabels = {
  welcome: "Welcome to GlobeTalk 🌍",
  instruction: "Select a friend or group from the left panel to start chatting in your preferred language.",
};

const Home = () => {
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
      height="100%"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box maxWidth="80%" maxHeight="90%" textAlign="center">
        <Stack spacing={2} textAlign="center">
          <ChatIcon sx={{ fontSize: "4rem", color: "#1976d2" }} />
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1a237e" }}>
            {translated.welcome}
          </Typography>
          <Typography variant="body1" sx={{ color: "#555" }}>
            {translated.instruction}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default AppLayout()(Home);
