import { Box, Drawer, Grid, Skeleton, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import api, { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params   = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket   = getSocket();
    const theme    = useTheme();
    const isDark   = theme.palette.mode === "dark";

    const chatId           = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((s) => s.misc);
    const { user }     = useSelector((s) => s.auth);
    const { newMessagesAlert } = useSelector((s) => s.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
        toast("New message received", { id: `new-message-${data.chatId}`, icon: "💬" });
      },
      [chatId, dispatch]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
      dispatch(api.util.invalidateTags(["User"]));
      toast("New friend request!", { icon: "👋" });
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]:       newRequestListener,
      [REFETCH_CHATS]:     refetchListener,
      [ONLINE_USERS]:      onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    // Sidebar background
    const sidebarBg  = isDark ? "#14152A" : "#FFFFFF";
    const profileBg  = isDark
      ? "linear-gradient(180deg, #1A1B2E 0%, #0F0F1A 100%)"
      : "linear-gradient(180deg, #EEF2FF 0%, #F5F6FA 100%)";
    const appBg      = isDark ? "#0F0F1A" : "#F5F6FA";

    return (
      <Box sx={{ bgcolor: appBg, minHeight: "100vh" }}>
        <Title />
        <Header />

        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

        {/* Mobile drawer */}
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer
            open={isMobile}
            onClose={handleMobileClose}
            PaperProps={{ sx: { bgcolor: sidebarBg, width: "80vw" } }}
          >
            <ChatList
              w="100%"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}

        {/* Desktop layout */}
        <Grid container height="calc(100vh - 4rem)">
          {/* ── Sidebar ─────────────────────────────────────── */}
          <Grid
            item sm={4} md={3}
            height="100%"
            sx={{
              display: { xs: "none", sm: "block" },
              bgcolor: sidebarBg,
              borderRight: `1px solid ${isDark ? "#2D2F4A" : "#E5E7EB"}`,
              overflow: "hidden",
            }}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" height="100%" />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </Grid>

          {/* ── Chat Area ────────────────────────────────────── */}
          <Grid
            item xs={12} sm={8} md={5} lg={6}
            height="100%"
            sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>

          {/* ── Profile Panel ────────────────────────────────── */}
          <Grid
            item md={4} lg={3}
            height="100%"
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: profileBg,
              borderLeft: `1px solid ${isDark ? "#2D2F4A" : "#E5E7EB"}`,
              padding: "2rem 1.5rem",
              overflow: "auto",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </Box>
    );
  };
};

export default AppLayout;
