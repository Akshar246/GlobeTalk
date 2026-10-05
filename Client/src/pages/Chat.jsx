import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";


import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack, Box } from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";

import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
  MESSAGE_READ,
  MESSAGES_SEEN,
} from "../constants/events";

import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";
import AISummariser from "../components/specific/AISummariser";
import VoiceInput from "../components/specific/VoiceInput";


const Chat = ({ chatId, user }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  // Tracks chatIds where the other party has read our messages (for ✓✓ ticks)
  const [seenChats, setSeenChats] = useState(new Set());


  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    // Don't emit typing events until chat members have loaded
    if (!members?.length) return;

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };


  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  // ─── Effects ─────────────────────────────────────────────────────────────────

  // Ref-guards so we don't double-emit when members re-renders for the same chat
  const joinedChatRef = useRef(null);
  const readSentRef   = useRef(null);

  // Effect 1 — Reset local state when chat switches + handle cleanup on leave
  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      joinedChatRef.current = null;
      readSentRef.current   = null;
      // members is captured from closure — might be stale but that's fine for leave
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  // Effect 2 — Fires once members data is loaded for the current chat.
  // This is what was broken: members is undefined when chatId first changes
  // because chatDetails is an async fetch. We watch [chatId, members] so this
  // runs again as soon as the query resolves, guaranteeing the emits happen.
  useEffect(() => {
    if (!chatId || !members?.length) return;

    // CHAT_JOINED — notify others we're online in this chat
    if (joinedChatRef.current !== chatId) {
      joinedChatRef.current = chatId;
      socket.emit(CHAT_JOINED, { userId: user._id, members });
    }

    // MESSAGE_READ — mark unread messages as seen + flip ✓ → ✓✓ for sender
    if (readSentRef.current !== chatId) {
      readSentRef.current = chatId;
      socket.emit(MESSAGE_READ, { chatId, members });
    }
  }, [chatId, members]);


  // Auto-scroll to newest message
  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Redirect if chat is not accessible
  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);


  // ─── Socket Event Listeners ───────────────────────────────────────────────────


  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "globetalk-admin",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  // When the other party opens our chat, this fires and we flip ticks to ✓✓
  const messagesSeenListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setSeenChats((prev) => new Set([...prev, data.chatId]));
    },
    [chatId]
  );

  // Memoised so useSocketEvents only re-registers on chatId change,
  // not on every single re-render (e.g. when a new message arrives).
  const eventHandler = useMemo(() => ({
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
    [MESSAGES_SEEN]: messagesSeenListener,
  }), [alertListener, newMessagesListener, startTypingListener, stopTypingListener, messagesSeenListener]);


  useSocketEvents(socket, eventHandler);
  useErrors(errors);

  // ─── Render ───────────────────────────────────────────────────────────────────

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton variant="rectangular" height="100%" />
  ) : (
    <Box display="flex" flexDirection="column" height="100%"
      sx={{ bgcolor: "background.default" }}
    >
      {/* ── AI top bar ──────────────────────────────────────────────── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        px={2}
        py={0.75}
        sx={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          minHeight: "2.8rem",
          flexShrink: 0,
        }}
      >
        {chatId && (
          <AISummariser
            chatId={chatId}
            onSmartReply={(text) => setMessage(text)}
          />
        )}
      </Stack>

      {/* ── Messages ────────────────────────────────────────────────── */}
      <Stack
        ref={containerRef}
        boxSizing="border-box"
        padding="1.5rem 1.25rem"
        spacing="0.6rem"
        sx={{
          flexGrow: 1,
          overflowX: "hidden",
          overflowY: "auto",
          bgcolor: "background.default",
          // Subtle dot grid pattern — premium touch
          backgroundImage: (theme) =>
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(79,70,229,0.06) 1px, transparent 1px)"
              : "radial-gradient(circle, rgba(79,70,229,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent
            key={i._id}
            message={i}
            user={user}
            isSeen={seenChats.has(chatId)}
          />
        ))}
        {userTyping && <TypingLoader />}
        <div ref={bottomRef} />
      </Stack>

      {/* ── Input bar ───────────────────────────────────────────────── */}
      <form onSubmit={submitHandler} style={{ flexShrink: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            px: 1.5,
            py: 1,
            bgcolor: "background.paper",
            borderTop: (theme) =>
              `1px solid ${theme.palette.mode === "dark" ? "#2D2F4A" : "#E5E7EB"}`,
          }}
        >
          <IconButton
            onClick={handleFileOpen}
            sx={{ color: "text.secondary" }}
          >
            <AttachFileIcon sx={{ rotate: "30deg" }} />
          </IconButton>

          <Box
            component="input"
            placeholder="Type a message..."
            value={message}
            onChange={messageOnChange}
            sx={{
              flexGrow: 1,
              border: "none",
              outline: "none",
              borderRadius: "12px",
              px: 2,
              py: 1.25,
              fontSize: "0.95rem",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "#0F0F1A" : "#F5F6FA",
              color: "text.primary",
              "&::placeholder": { color: "text.secondary" },
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)",
            }}
          />

          <VoiceInput onResult={(transcript) => setMessage((prev) => prev + transcript)} />

          <IconButton
            type="submit"
            disabled={!message.trim()}
            sx={{
              background: message.trim()
                ? "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
                : "transparent",
              border: (theme) =>
                message.trim()
                  ? "none"
                  : `1.5px solid ${theme.palette.mode === "dark" ? "#2D2F4A" : "#E5E7EB"}`,
              color: message.trim() ? "white" : "text.secondary",
              width: 44,
              height: 44,
              transition: "all 0.2s",
              boxShadow: message.trim() ? "0 4px 12px rgba(79,70,229,0.4)" : "none",
              "&:hover": {
                background: message.trim()
                  ? "linear-gradient(135deg, #3730A3 0%, #6D28D9 100%)"
                  : "transparent",
                transform: message.trim() ? "scale(1.05)" : "none",
              },
            }}
          >
            <SendIcon sx={{ fontSize: "1.1rem" }} />
          </IconButton>
        </Stack>

      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Box>
  );

};

export default AppLayout()(Chat);
