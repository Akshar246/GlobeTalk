import { useInputValidation } from "6pp";
import { Search as SearchIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
  Typography,
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

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();
  const search = useInputValidation("");

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
        .then(({ data }) => {
          // Guard: data may be undefined on first load or error
          setUsers(data?.users || []);
        })
        .catch((e) => {
          console.error("Search error:", e);
          setUsers([]);
        })
        .finally(() => setIsSearching(false));
    }, 500); // reduced from 1000ms to 500ms for snappier feel

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>

        <TextField
          label="Search by name..."
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Loading state */}
        {isSearching && (
          <Stack alignItems="center" py={2}>
            <CircularProgress size={24} />
          </Stack>
        )}

        {/* Results */}
        {!isSearching && users.length > 0 && (
          <List>
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

        {/* Empty state */}
        {!isSearching && users.length === 0 && search.value && (
          <Stack alignItems="center" py={3} spacing={1}>
            <PersonAddIcon sx={{ fontSize: "2.5rem", color: "#bbb" }} />
            <Typography variant="body2" color="text.secondary">
              No users found for "{search.value}"
            </Typography>
          </Stack>
        )}

        {/* Hint when nothing typed yet */}
        {!isSearching && !search.value && users.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={2}
          >
            Start typing to search for people
          </Typography>
        )}
      </Stack>
    </Dialog>
  );
};

export default Search;