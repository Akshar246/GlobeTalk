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
  useTheme,
} from "@mui/material";
import React, { Suspense, lazy, useState } from "react";
import {
  Add as AddIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AccountCircle as AccountCircleIcon,
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

const SearchDialog     = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog   = lazy(() => import("../specific/NewGroup"));

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
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const theme      = useTheme();
  const isDark     = theme.palette.mode === "dark";

  const { isSearch, isNotification, isNewGroup } = useSelector((s) => s.misc);
  const { notificationCount } = useSelector((s) => s.chat);

  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("preferredLanguage") || "en"
  );
  const [langLoading, setLangLoading] = useState(false);

  const handleMobile      = () => dispatch(setIsMobile(true));
  const openSearch        = () => dispatch(setIsSearch(true));
  const openNewGroup      = () => dispatch(setIsNewGroup(true));
  const openNotification  = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  const navigateToGroup = () => navigate("/groups");

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    window.__setGlobeTalkTheme?.(next);
  };

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
      dispatch(api.util.invalidateTags(["Message"]));
      toast.success("Language updated!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update language");
    } finally {
      setLangLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height="4rem">
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ gap: 0.5, minHeight: "4rem !important" }}>
            {/* Logo */}
            <Typography
              variant="h6"
              onClick={() => navigate("/")}
              sx={{
                display: { xs: "none", sm: "flex" },
                cursor: "pointer",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                alignItems: "center",
                gap: 1,
                mr: 1,
              }}
            >
              🌐 GlobeTalk
            </Typography>

            {/* Hamburger — mobile only */}
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Language picker */}
            <Tooltip title="Switch language">
              <Select
                value={selectedLang}
                onChange={handleLanguageChange}
                disabled={langLoading}
                size="small"
                variant="outlined"
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.12)",
                  borderRadius: 2,
                  height: "2.1rem",
                  minWidth: 128,
                  fontSize: "0.82rem",
                  ".MuiOutlinedInput-notchedOutline": { border: "none" },
                  ".MuiSvgIcon-root": { color: "white" },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
              >
                {LANGUAGES.map(({ code, label }) => (
                  <MenuItem key={code} value={code} sx={{ fontSize: "0.88rem" }}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </Tooltip>

            {/* Nav icons */}
            <IconBtn title="Home"            icon={<HomeIcon />}          onClick={() => navigate("/")} />
            <IconBtn title="Search people"   icon={<SearchIcon />}        onClick={openSearch} />
            <IconBtn title="New group"       icon={<AddIcon />}           onClick={openNewGroup} />
            <IconBtn title="Manage groups"   icon={<GroupIcon />}         onClick={navigateToGroup} />
            <IconBtn
              title="Notifications"
              icon={<NotificationsIcon />}
              onClick={openNotification}
              value={notificationCount}
            />

            <IconBtn
              title="My Profile"
              icon={<AccountCircleIcon />}
              onClick={() => navigate("/profile")}
            />

            {/* Theme toggle */}
            <Tooltip title={isDark ? "Switch to Light" : "Switch to Dark"}>
              <IconButton color="inherit" onClick={toggleTheme} size="large">
                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <IconBtn title="Logout" icon={<LogoutIcon />} onClick={logoutHandler} />
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch      && <Suspense fallback={<Backdrop open />}><SearchDialog /></Suspense>}
      {isNotification && <Suspense fallback={<Backdrop open />}><NotifcationDialog /></Suspense>}
      {isNewGroup    && <Suspense fallback={<Backdrop open />}><NewGroupDialog /></Suspense>}
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => (
  <Tooltip title={title}>
    <IconButton color="inherit" size="large" onClick={onClick}>
      {value ? (
        <Badge badgeContent={value} color="error">{icon}</Badge>
      ) : icon}
    </IconButton>
  </Tooltip>
);

export default Header;
