import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack, Box } from "@mui/material";
import { grayColor, orange } from "../constants/color";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
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

  // Join/leave chat room and clear state on chat switch
  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

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

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);
  useErrors(errors);

  // ─── Render ───────────────────────────────────────────────────────────────────

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Box display="flex" flexDirection="column" height="100%">
      {/* ── AI top bar ──────────────────────────────────────────────────────── */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        px={2}
        py={0.75}
        sx={{ bgcolor: orange, minHeight: "2.8rem", flexShrink: 0 }}
      >
        {chatId && (
          <AISummariser
            chatId={chatId}
            onSmartReply={(text) => setMessage(text)}
          />
        )}
      </Stack>

      {/* ── Message List Area ───────────────────────────────────────────────── */}
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1.5rem 1rem"}
        spacing={"0.5rem"}
        bgcolor={"#efeae2"} // WhatsApp web chat background
        sx={{
          flexGrow: 1,
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
      </Stack>

      {/* ── Input Area ──────────────────────────────────────────────────────── */}
      <form onSubmit={submitHandler} style={{ flexShrink: 0 }}>
        <Stack
          direction={"row"}
          padding={"0.75rem 1rem"}
          alignItems={"center"}
          bgcolor={"#f0f2f5"}
          spacing={1}
        >
          <IconButton onClick={handleFileOpen} sx={{ color: "#54656f", p: "0.5rem" }}>
            <AttachFileIcon sx={{ rotate: "30deg" }} />
          </IconButton>

          <InputBox
            placeholder="Type a message..."
            value={message}
            onChange={messageOnChange}
            style={{
              flexGrow: 1,
              borderRadius: "1.5rem",
              padding: "0.75rem 1.25rem",
              border: "none",
              outline: "none",
              backgroundColor: "#ffffff",
              fontSize: "0.95rem",
              color: "#111b21",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          />

          <IconButton
            type="submit"
            disabled={!message.trim()}
            sx={{
              bgcolor: message.trim() ? "#00a884" : "#e9edef",
              color: message.trim() ? "white" : "#9ca3af",
              padding: "0.6rem",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: message.trim() ? "#008f6f" : "#e9edef",
              },
            }}
          >
            <SendIcon sx={{ rotate: "-30deg", transform: "translateX(2px)" }} />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Box>
  );
};

export default AppLayout()(Chat);
