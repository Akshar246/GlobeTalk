import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy, useState } from "react";
import { orange } from "../../constants/color";
import {
  Add as AddIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import api from "../../redux/api/api";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

// ── Supported languages list ────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", label: "🇬🇧 English" },
  { code: "hi", label: "🇮🇳 Hindi" },
  { code: "fr", label: "🇫🇷 French" },
  { code: "es", label: "🇪🇸 Spanish" },
  { code: "de", label: "🇩🇪 German" },
  { code: "it", label: "🇮🇹 Italian" },
  { code: "ja", label: "🇯🇵 Japanese" },
  { code: "ko", label: "🇰🇷 Korean" },
  { code: "zh", label: "🇨🇳 Chinese" },
  { code: "ar", label: "🇸🇦 Arabic" },
  { code: "pt", label: "🇵🇹 Portuguese" },
  { code: "ru", label: "🇷🇺 Russian" },
];

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

  // Initialise from localStorage so it persists across refreshes
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("preferredLanguage") || "en"
  );
  const [langLoading, setLangLoading] = useState(false);

  const handleMobile = () => dispatch(setIsMobile(true));
  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => dispatch(setIsNewGroup(true));
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  const navigateToGroup = () => navigate("/groups");

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // ── Language switcher ─────────────────────────────────────────────────────────
  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    if (newLang === selectedLang || langLoading) return;

    setLangLoading(true);
    try {
      await axios.patch(
        `${server}/api/v1/user/language`,
        { language: newLang },
        { withCredentials: true }
      );
      setSelectedLang(newLang);
      localStorage.setItem("preferredLanguage", newLang);

      // Invalidate message cache so all chats reload with new language
      dispatch(api.util.invalidateTags(["Message"]));

      toast.success("Language updated! Your chats will reload with translated messages.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update language");
    } finally {
      setLangLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar position="static" sx={{ bgcolor: orange }}>
          <Toolbar>
            {/* App name — hidden on mobile */}
            <Typography
              variant="h6"
              onClick={() => navigate("/")}
              sx={{
                display: { xs: "none", sm: "block" },
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              GlobeTalk
            </Typography>

            {/* Hamburger — visible on mobile only */}
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* ── Language Picker ─────────────────────────────────────── */}
              <Tooltip title="Switch your language">
                <Select
                  value={selectedLang}
                  onChange={handleLanguageChange}
                  disabled={langLoading}
                  size="small"
                  variant="outlined"
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.15)",
                    borderRadius: 2,
                    height: "2.2rem",
                    minWidth: 140,
                    fontSize: "0.85rem",
                    ".MuiOutlinedInput-notchedOutline": { border: "none" },
                    ".MuiSvgIcon-root": { color: "white" },
                    "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                  }}
                >
                  {LANGUAGES.map(({ code, label }) => (
                    <MenuItem key={code} value={code} sx={{ fontSize: "0.9rem" }}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </Tooltip>

              {/* ── Nav Buttons ──────────────────────────────────────────── */}
              <IconBtn
                title={"Home"}
                icon={<HomeIcon />}
                onClick={() => navigate("/")}
              />
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearch}
              />
              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />
              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />
              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />
              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotifcationDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

// ── Reusable icon button with optional badge ────────────────────────────────────
const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
