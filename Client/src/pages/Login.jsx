import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CameraAlt as CameraAltIcon,
  Visibility,
  VisibilityOff,
  Language as LanguageIcon,
  ChatBubble as ChatBubbleIcon,
  AutoAwesome as SparkleIcon,
  Translate as TranslateIcon,
} from "@mui/icons-material";
import { useFileHandler, useInputValidation } from "6pp";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import languageOptions from "../constants/languageOptions";
import { setLanguage as setLanguageRedux } from "../redux/reducers/misc";

// ── Feature callouts shown in the brand panel ────────────────────────────────
const FEATURES = [
  {
    icon: <TranslateIcon sx={{ fontSize: "1.1rem" }} />,
    title: "Real-time Translation",
    desc: "Messages auto-translate to each person's language",
  },
  {
    icon: <ChatBubbleIcon sx={{ fontSize: "1.1rem" }} />,
    title: "AI Conversation Summary",
    desc: "Catch up instantly with Gemini-powered summaries",
  },
  {
    icon: <SparkleIcon sx={{ fontSize: "1.1rem" }} />,
    title: "Smart Replies",
    desc: "AI suggests context-aware replies with one tap",
  },
];

const Login = () => {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showPassword, setShowPassword] = useState(false);

  const name     = useInputValidation("");
  const bio      = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const avatar   = useFileHandler("single");

  const dispatch = useDispatch();

  // ── Labels + translation ─────────────────────────────────────────────────────
  const originalLabels = {
    login: "Sign in", signup: "Create account",
    username: "Username", password: "Password",
    name: "Full name", bio: "Short bio",
    loginInstead: "Already have an account? Sign in",
    signupInstead: "New here? Create account",
    welcomeBack: "Welcome back", createAccount: "Join GlobeTalk",
    title: "One chat. Every language.", language: "Language",
  };

  const [translated, setTranslated] = useState(originalLabels);

  useEffect(() => {
    localStorage.setItem("preferredLanguage", language);
    dispatch(setLanguageRedux(language));
    if (language === "en") { setTranslated(originalLabels); return; }
    axios.post(`${server}/api/v1/translate`, {
      text: Object.values(originalLabels),
      targetLanguage: language,
    }).then(({ data }) => {
      const out = {};
      Object.keys(originalLabels).forEach((k, i) => { out[k] = data.translations[i]; });
      setTranslated(out);
    }).catch(() => {});
  }, [language]);

  // ── Auth handlers ────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Signing in...");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        { username: username.value, password: password.value },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      dispatch(userExists(data.user));
      const lang = data.user.language || "en";
      localStorage.setItem("preferredLanguage", lang);
      setLanguage(lang);
      toast.success(data.message, { id: tid });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cannot connect to server.", { id: tid });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Creating account...");
    setIsLoading(true);
    const fd = new FormData();
    fd.append("avatar", avatar.file);
    fd.append("name", name.value);
    fd.append("bio", bio.value);
    fd.append("username", username.value);
    fd.append("password", password.value);
    fd.append("language", language);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(userExists(data.user));
      toast.success(data.message, { id: tid });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed.", { id: tid });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Shared field sx ──────────────────────────────────────────────────────────
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
      fontSize: "0.95rem",
      "& fieldset": { borderColor: isDark ? "#2D2F4A" : "#E5E7EB" },
      "&:hover fieldset": { borderColor: "#4F46E5" },
      "&.Mui-focused fieldset": { borderColor: "#4F46E5", borderWidth: "2px" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#4F46E5" },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        bgcolor: isDark ? "#0F0F1A" : "#F5F6FA",
      }}
    >
      {/* ══════════════════ LEFT — Brand Panel ══════════════════ */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          p: { md: 6, lg: 8 },
          background: "linear-gradient(145deg, #1E1B4B 0%, #312E81 30%, #4F46E5 65%, #7C3AED 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background circles */}
        <Box sx={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />
        <Box sx={{ position: "absolute", bottom: -60, left: -60, width: 240, height: 240, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />
        <Box sx={{ position: "absolute", bottom: "30%", right: "10%", width: 120, height: 120, borderRadius: "50%", bgcolor: "rgba(245,158,11,0.12)" }} />

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 460 }}>
          {/* Logo */}
          <Chip
            icon={<LanguageIcon sx={{ color: "#fff !important", fontSize: "1rem" }} />}
            label="GlobeTalk"
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "0.9rem",
              mb: 4,
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.1,
              mb: 2,
              fontSize: { md: "2.6rem", lg: "3rem" },
            }}
          >
            {translated.title}
          </Typography>

          <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "1.05rem", mb: 5, lineHeight: 1.7 }}>
            Break language barriers and connect with anyone, anywhere — in real time.
          </Typography>

          {/* Feature cards */}
          <Stack spacing={1.5}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 3,
                    p: 1.75,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(245,158,11,0.25)",
                      borderRadius: 2,
                      p: 0.75,
                      color: "#F59E0B",
                      display: "flex",
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={700} color="#FFFFFF" lineHeight={1.3}>
                      {f.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>
                      {f.desc}
                    </Typography>
                  </Box>
                </Stack>
              </motion.div>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* ══════════════════ RIGHT — Form Panel ══════════════════ */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 3, sm: 5, md: 6 },
          bgcolor: isDark ? "#0F0F1A" : "#FFFFFF",
          overflow: "auto",
        }}
      >
        <Box sx={{ maxWidth: 420, width: "100%", mx: "auto" }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 3 }}>
            <LanguageIcon sx={{ color: "#4F46E5", fontSize: "1.5rem" }} />
            <Typography fontWeight={800} fontSize="1.2rem" color="#4F46E5">GlobeTalk</Typography>
          </Box>

          {/* Tab switcher */}
          <Stack
            direction="row"
            sx={{
              bgcolor: isDark ? "#1A1B2E" : "#F3F4F6",
              borderRadius: "12px",
              p: "4px",
              mb: 4,
            }}
          >
            {["Sign in", "Create account"].map((label, i) => (
              <Button
                key={label}
                fullWidth
                onClick={() => setIsLogin(i === 0)}
                sx={{
                  borderRadius: "9px",
                  py: 1,
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  textTransform: "none",
                  transition: "all 0.2s",
                  bgcolor: (i === 0 && isLogin) || (i === 1 && !isLogin)
                    ? isDark ? "#FFFFFF" : "#FFFFFF"
                    : "transparent",
                  color: (i === 0 && isLogin) || (i === 1 && !isLogin)
                    ? "#4F46E5"
                    : isDark ? "#8B8FA8" : "#6B7280",
                  boxShadow: (i === 0 && isLogin) || (i === 1 && !isLogin)
                    ? "0 1px 4px rgba(0,0,0,0.12)"
                    : "none",
                  "&:hover": {
                    bgcolor: (i === 0 && isLogin) || (i === 1 && !isLogin)
                      ? "#FFFFFF"
                      : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Stack>

          {/* Heading */}
          <Typography variant="h5" fontWeight={700} color="text.primary" mb={0.5}>
            {isLogin ? "Welcome back 👋" : "Create your account ✨"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {isLogin
              ? "Sign in to continue your conversations"
              : "Join GlobeTalk and start chatting across languages"}
          </Typography>

          {/* Language selector */}
          <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{
                borderRadius: "10px",
                bgcolor: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: isDark ? "#2D2F4A" : "#E5E7EB" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#4F46E5" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#4F46E5", borderWidth: "2px" },
              }}
              startAdornment={
                <InputAdornment position="start">
                  <LanguageIcon sx={{ fontSize: "1.1rem", color: "#4F46E5", mr: 0.5 }} />
                </InputAdornment>
              }
            >
              {languageOptions.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider sx={{ mb: 2.5, borderColor: isDark ? "#2D2F4A" : "#E5E7EB" }} />

          {/* ── FORMS ── */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleLogin}
              >
                <Stack spacing={2}>
                  <TextField
                    required
                    fullWidth
                    label={translated.username}
                    value={username.value}
                    onChange={username.changeHandler}
                    autoFocus
                    sx={fieldSx}
                  />
                  <TextField
                    required
                    fullWidth
                    label={translated.password}
                    type={showPassword ? "text" : "password"}
                    value={password.value}
                    onChange={password.changeHandler}
                    sx={fieldSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" size="small">
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{
                      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      color: "#fff",
                      borderRadius: "10px",
                      py: 1.4,
                      fontSize: "0.97rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 16px rgba(79,70,229,0.4)",
                      mt: 0.5,
                      "&:hover": {
                        background: "linear-gradient(135deg, #3730A3 0%, #6D28D9 100%)",
                        boxShadow: "0 6px 20px rgba(79,70,229,0.5)",
                      },
                      "&:disabled": { background: isDark ? "#2D2F4A" : "#E5E7EB", color: "#9CA3AF", boxShadow: "none" },
                    }}
                  >
                    {isLoading ? "Signing in..." : translated.login}
                  </Button>
                </Stack>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleSignUp}
              >
                <Stack spacing={2}>
                  {/* Avatar upload */}
                  <Stack alignItems="center" py={1}>
                    <Box sx={{ position: "relative", width: 88, height: 88 }}>
                      <Box
                        sx={{
                          width: 88,
                          height: 88,
                          borderRadius: "50%",
                          background: avatar.preview
                            ? "none"
                            : "linear-gradient(135deg, #4F46E5, #7C3AED)",
                          p: avatar.preview ? "3px" : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Avatar
                          src={avatar.preview}
                          sx={{
                            width: avatar.preview ? 82 : 88,
                            height: avatar.preview ? 82 : 88,
                            bgcolor: "#312E81",
                            fontSize: "2rem",
                          }}
                        >
                          {!avatar.preview && "👤"}
                        </Avatar>
                      </Box>
                      <IconButton
                        component="label"
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: -4,
                          right: -4,
                          bgcolor: "#4F46E5",
                          color: "white",
                          width: 28,
                          height: 28,
                          "&:hover": { bgcolor: "#3730A3" },
                          boxShadow: "0 2px 8px rgba(79,70,229,0.5)",
                        }}
                      >
                        <>
                          <CameraAltIcon sx={{ fontSize: "0.85rem" }} />
                          <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                        </>
                      </IconButton>
                    </Box>
                    {avatar.error && (
                      <Typography color="error" variant="caption" mt={0.5}>{avatar.error}</Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" mt={0.75}>
                      Upload profile photo
                    </Typography>
                  </Stack>

                  <TextField required fullWidth label={translated.name} value={name.value} onChange={name.changeHandler} sx={fieldSx} />
                  <TextField fullWidth label={translated.bio} value={bio.value} onChange={bio.changeHandler} sx={fieldSx} placeholder="Tell us something about yourself..." />
                  <TextField
                    required
                    fullWidth
                    label={translated.username}
                    value={username.value}
                    onChange={username.changeHandler}
                    sx={fieldSx}
                    error={!!username.error}
                    helperText={username.error}
                  />
                  <TextField
                    required
                    fullWidth
                    label={translated.password}
                    type={showPassword ? "text" : "password"}
                    value={password.value}
                    onChange={password.changeHandler}
                    sx={fieldSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" size="small">
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{
                      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      color: "#fff",
                      borderRadius: "10px",
                      py: 1.4,
                      fontSize: "0.97rem",
                      fontWeight: 700,
                      boxShadow: "0 4px 16px rgba(79,70,229,0.4)",
                      mt: 0.5,
                      "&:hover": {
                        background: "linear-gradient(135deg, #3730A3 0%, #6D28D9 100%)",
                        boxShadow: "0 6px 20px rgba(79,70,229,0.5)",
                      },
                      "&:disabled": { background: isDark ? "#2D2F4A" : "#E5E7EB", color: "#9CA3AF", boxShadow: "none" },
                    }}
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </Stack>
              </motion.form>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
