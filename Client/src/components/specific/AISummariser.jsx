import {
  AutoAwesome as AutoAwesomeIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSummariseChatMutation, useSmartReplyMutation } from "../../redux/api/api";

// ── AISummariser ─────────────────────────────────────────────────────────────
// Shows a "✨" button in the chat header. On click opens a dialog with:
//  - Gemini bullet-point summary of the last 50 messages
//  - 3 smart reply chips the user can click to pre-fill the message box

const AISummariser = ({ chatId, onSmartReply }) => {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [replies, setReplies] = useState([]);
  const [msgCount, setMsgCount] = useState(0);

  const [summarise, { isLoading: isSummarising }] = useSummariseChatMutation();
  const [getSmartReplies, { isLoading: isGettingReplies }] = useSmartReplyMutation();

  const handleOpen = async () => {
    setOpen(true);
    setSummary("");
    setReplies([]);

    try {
      const [sumRes, replyRes] = await Promise.all([
        summarise(chatId).unwrap(),
        getSmartReplies(chatId).unwrap(),
      ]);
      setSummary(sumRes.summary);
      setMsgCount(sumRes.messageCount);
      setReplies(replyRes.replies || []);
    } catch (err) {
      const msg =
        err?.data?.message || err?.error || "AI unavailable — check your API key on Render";
      toast.error(msg);
      setOpen(false);
    }
  };

  const handleClose = () => setOpen(false);

  const handleReplyClick = (text) => {
    onSmartReply(text);
    setOpen(false);
  };

  const isLoading = isSummarising || isGettingReplies;

  // Parse bullet points from Gemini response
  const bullets = summary
    ? summary
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.startsWith("•") || l.startsWith("-") || l.length > 0)
        .filter(Boolean)
    : [];

  return (
    <>
      {/* Trigger button in chat header */}
      <Tooltip title="AI Summary & Smart Replies">
        <IconButton
          onClick={handleOpen}
          size="small"
          sx={{
            color: "white",
            bgcolor: "rgba(255,255,255,0.15)",
            borderRadius: 2,
            px: 1.5,
            gap: 0.5,
            "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
          }}
        >
          <AutoAwesomeIcon fontSize="small" />
          <Typography variant="caption" fontWeight={600}>
            AI
          </Typography>
        </IconButton>
      </Tooltip>

      {/* Summary + Smart Reply Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: "hidden" },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #1a237e 0%, #00838f 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <AutoAwesomeIcon />
            <Typography fontWeight={700}>AI Assistant</Typography>
          </Stack>
          <IconButton onClick={handleClose} sx={{ color: "white" }} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {isLoading ? (
            <Stack alignItems="center" spacing={2} py={4}>
              <CircularProgress />
              <Typography color="text.secondary" variant="body2">
                Gemini is reading your conversation...
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={3}>
              {/* Summary section */}
              <Box>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={700}
                  letterSpacing={1.5}
                >
                  Conversation Summary
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                  Based on the last {msgCount} messages
                </Typography>

                <Box
                  sx={{
                    bgcolor: "#f8f9ff",
                    borderRadius: 2,
                    p: 2,
                    border: "1px solid #e3e8ff",
                  }}
                >
                  {bullets.map((line, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      sx={{ mb: 0.75, lineHeight: 1.6, color: "#1f2937" }}
                    >
                      {line}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Divider />

              {/* Smart replies section */}
              {replies.length > 0 && (
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    fontWeight={700}
                    letterSpacing={1.5}
                    display="block"
                    mb={1.5}
                  >
                    Smart Replies — tap to use
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {replies.map((reply, i) => (
                      <Chip
                        key={i}
                        label={reply}
                        onClick={() => handleReplyClick(reply)}
                        clickable
                        variant="outlined"
                        sx={{
                          borderColor: "#1a237e",
                          color: "#1a237e",
                          fontWeight: 600,
                          "&:hover": {
                            bgcolor: "#1a237e",
                            color: "white",
                          },
                          transition: "all 0.2s",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AISummariser;
