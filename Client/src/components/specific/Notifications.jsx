import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  ListItem,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  NotificationsNone as BellIcon,
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const theme    = useTheme();
  const isDark   = theme.palette.mode === "dark";

  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Processing...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);

  const count = data?.allRequests?.length || 0;

  return (
    <Dialog open={isNotification} onClose={closeHandler} maxWidth="xs" fullWidth>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <BellIcon sx={{ color: "white", fontSize: "1.4rem" }} />
        <Typography variant="h6" fontWeight={700} color="white">
          Notifications
        </Typography>
        {count > 0 && (
          <Box
            sx={{
              ml: "auto",
              bgcolor: "rgba(255,255,255,0.25)",
              borderRadius: 99,
              px: 1.5,
              py: 0.25,
            }}
          >
            <Typography variant="caption" fontWeight={700} color="white">
              {count} pending
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ maxHeight: "60vh", overflowY: "auto", bgcolor: "background.paper" }}>
        {isLoading ? (
          <Stack spacing={1} p={2}>
            {[1, 2].map((i) => <Skeleton key={i} variant="rectangular" height={72} sx={{ borderRadius: 2 }} />)}
          </Stack>
        ) : count > 0 ? (
          <Stack divider={<Divider />}>
            {data.allRequests.map(({ sender, _id }) => (
              <NotificationItem
                key={_id}
                sender={sender}
                _id={_id}
                handler={friendRequestHandler}
                isDark={isDark}
              />
            ))}
          </Stack>
        ) : (
          <Stack alignItems="center" spacing={1.5} py={6}>
            <BellIcon sx={{ fontSize: "3rem", color: "text.secondary", opacity: 0.4 }} />
            <Typography color="text.secondary" variant="body2">
              You're all caught up!
            </Typography>
            <Typography color="text.secondary" variant="caption">
              New friend requests will appear here
            </Typography>
          </Stack>
        )}
      </Box>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler, isDark }) => {
  const { name, avatar } = sender;
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ px: 2.5, py: 2, "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(79,70,229,0.04)" } }}
    >
      <Avatar
        src={avatar}
        sx={{ width: 44, height: 44, border: "2px solid #4F46E5" }}
      />

      <Typography
        variant="body2"
        sx={{ flex: 1, fontWeight: 500, lineHeight: 1.4 }}
      >
        <Typography component="span" fontWeight={700}>{name}</Typography>
        {" sent you a friend request."}
      </Typography>

      <Stack direction="row" spacing={0.75}>
        <Button
          size="small"
          onClick={() => handler({ _id, accept: true })}
          startIcon={<CheckIcon fontSize="small" />}
          sx={{
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            color: "white",
            borderRadius: 8,
            textTransform: "none",
            fontSize: "0.78rem",
            px: 1.5,
            py: 0.75,
            minWidth: 0,
            "&:hover": {
              background: "linear-gradient(135deg, #3730A3 0%, #6D28D9 100%)",
            },
          }}
        >
          Accept
        </Button>
        <Button
          size="small"
          onClick={() => handler({ _id, accept: false })}
          startIcon={<CloseIcon fontSize="small" />}
          sx={{
            border: "1.5px solid",
            borderColor: isDark ? "#2D2F4A" : "#E5E7EB",
            color: "text.secondary",
            borderRadius: 8,
            textTransform: "none",
            fontSize: "0.78rem",
            px: 1.5,
            py: 0.75,
            minWidth: 0,
          }}
        >
          Decline
        </Button>
      </Stack>
    </Stack>
  );
});

export default Notifications;