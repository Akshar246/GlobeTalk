import { useInputValidation } from "6pp";
import {
  Search as SearchIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Dialog,
  InputAdornment,
  List,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();
  const search   = useInputValidation("");

  const [users, setUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    setIsSearching(true);
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data?.users || []))
        .catch(() => setUsers([]))
        .finally(() => setIsSearching(false));
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler} maxWidth="xs" fullWidth>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          px: 3,
          py: 2.5,
        }}
      >
        <Typography variant="h6" fontWeight={700} color="white">
          Find People
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
          Search by name to add new friends
        </Typography>
      </Box>

      <Box sx={{ bgcolor: "background.paper", p: 2.5 }}>
        {/* Search field */}
        <TextField
          fullWidth
          placeholder="Search by name..."
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#4F46E5" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: isDark ? "#0F0F1A" : "#F5F6FA",
              "& fieldset": { borderColor: isDark ? "#2D2F4A" : "#E5E7EB" },
              "&:hover fieldset": { borderColor: "#4F46E5" },
              "&.Mui-focused fieldset": { borderColor: "#4F46E5" },
            },
          }}
        />

        {/* States */}
        {isSearching && (
          <Stack alignItems="center" py={3}>
            <CircularProgress size={28} sx={{ color: "#4F46E5" }} />
          </Stack>
        )}

        {!isSearching && users.length > 0 && (
          <List disablePadding>
            {users.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))}
          </List>
        )}

        {!isSearching && users.length === 0 && search.value && (
          <Stack alignItems="center" spacing={1.5} py={4}>
            <PersonAddIcon sx={{ fontSize: "2.5rem", color: "#4F46E5", opacity: 0.4 }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No users found for "<strong>{search.value}</strong>"
            </Typography>
          </Stack>
        )}

        {!isSearching && !search.value && (
          <Stack alignItems="center" spacing={1} py={3}>
            <SearchIcon sx={{ fontSize: "2.5rem", color: "text.secondary", opacity: 0.3 }} />
            <Typography variant="body2" color="text.secondary">
              Start typing to discover people
            </Typography>
          </Stack>
        )}
      </Box>
    </Dialog>
  );
};

export default Search;