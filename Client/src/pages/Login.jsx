import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CameraAlt as CameraAltIcon, Translate as TranslateIcon } from "@mui/icons-material";
import { useFileHandler, useInputValidation } from "6pp";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import languageOptions from "../constants/languageOptions";
import { setLanguage as setLanguageRedux } from "../redux/reducers/misc";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en");

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const originalLabels = {
    login: "Login",
    signup: "Sign Up",
    username: "Username",
    password: "Password",
    name: "Name",
    bio: "Bio",
    loginInstead: "Login Instead",
    signupInstead: "Create New Account",
    or: "OR",
    title: "One chat. Every language.",
    subtitle:
      "GlobeTalk translates your messages in real time so each person reads in their own preferred language.",
    language: "Language",
    selectLanguage: "Choose language",
    welcomeBack: "Welcome back",
    createAccount: "Create your account",
  };

  const [translated, setTranslated] = useState(originalLabels);

  const translateLabels = async () => {
    localStorage.setItem("preferredLanguage", language);
    dispatch(setLanguageRedux(language));

    if (language === "en") {
      setTranslated(originalLabels);
      return;
    }

    try {
      const { data } = await axios.post(`${server}/api/v1/translate`, {
        text: Object.values(originalLabels),
        targetLanguage: language,
      });

      const newTranslated = {};
      Object.keys(originalLabels).forEach((key, idx) => {
        newTranslated[key] = data.translations[idx];
      });

      setTranslated(newTranslated);
    } catch (err) {
      console.error("Translation failed:", err);
      toast.error("Failed to translate");
    }
  };

  useEffect(() => {
    translateLabels();
  }, [language]);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(`${translated.login}...`);
    setIsLoading(true);

    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );

      dispatch(userExists(data.user));

      const preferredLang = data.user.language || "en";
      localStorage.setItem("preferredLanguage", preferredLang);
      setLanguage(preferredLang);

      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cannot connect to server. Please check backend is running on port 3000.", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(`${translated.signup}...`);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    formData.append("language", language);

    const config = {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cannot connect to server. Please check backend is running on port 3000.", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #fff3e6 0%, #ffe0b2 35%, #d6e4ff 100%)",
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 6,
            overflow: "hidden",
            border: "1px solid rgba(19, 44, 86, 0.12)",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
            minHeight: { xs: "auto", md: "84vh" },
            backdropFilter: "blur(6px)",
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 6 },
              background: "linear-gradient(155deg, #0d47a1 0%, #1565c0 45%, #00838f 100%)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Box>
              <Chip
                icon={<TranslateIcon sx={{ color: "#fff !important" }} />}
                label="GlobeTalk"
                sx={{
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontWeight: 700,
                  mb: 3,
                }}
              />

              <Typography variant="h3" fontWeight={800} lineHeight={1.15} mb={2}>
                {translated.title}
              </Typography>

              <Typography sx={{ opacity: 0.95, maxWidth: 560 }}>
                {translated.subtitle}
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                • Real-time translated conversations
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                • Works across multilingual teams
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                • Simple onboarding for new users
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 3, md: 5 }, bgcolor: "#ffffff" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant={isLogin ? "contained" : "text"}
                  onClick={() => setIsLogin(true)}
                  disabled={isLoading}
                  sx={{ borderRadius: 99, px: 2.5, textTransform: "none" }}
                >
                  {translated.login}
                </Button>
                <Button
                  variant={!isLogin ? "contained" : "text"}
                  onClick={() => setIsLogin(false)}
                  disabled={isLoading}
                  sx={{ borderRadius: 99, px: 2.5, textTransform: "none" }}
                >
                  {translated.signup}
                </Button>
              </Stack>

              <FormControl size="small" sx={{ minWidth: 170 }}>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  inputProps={{ "aria-label": translated.selectLanguage }}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    bgcolor: "#f4f8ff",
                  }}
                >
                  {languageOptions.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.flag} {lang.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Typography variant="h5" fontWeight={700} mb={0.5}>
              {isLogin ? translated.welcomeBack : translated.createAccount}
            </Typography>

            <Typography variant="body2" color="text.secondary" mb={3}>
              {translated.language}: {languageOptions.find((item) => item.code === language)?.label || "English"}
            </Typography>

            {isLogin ? (
              <form onSubmit={handleLogin}>
                <TextField
                  required
                  fullWidth
                  label={translated.username}
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label={translated.password}
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                  size="large"
                >
                  {translated.login}
                </Button>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                  sx={{ mt: 1.5, textTransform: "none" }}
                >
                  {translated.signupInstead}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignUp}>
                <Stack position="relative" width="6rem" margin="0 auto 0.5rem">
                  <Avatar
                    sx={{
                      width: "6rem",
                      height: "6rem",
                      objectFit: "cover",
                      border: "2px solid #d7e6ff",
                    }}
                    src={avatar.preview}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: -8,
                      right: -8,
                      color: "white",
                      bgcolor: "#0d47a1",
                      ":hover": {
                        bgcolor: "#08306b",
                      },
                    }}
                    component="label"
                    size="small"
                  >
                    <>
                      <CameraAltIcon fontSize="small" />
                      <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                    </>
                  </IconButton>
                </Stack>

                {avatar.error && (
                  <Typography mt={1} color="error" variant="caption" display="block" textAlign="center">
                    {avatar.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label={translated.name}
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label={translated.bio}
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label={translated.username}
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label={translated.password}
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                  size="large"
                >
                  {translated.signup}
                </Button>

                <Button
                  disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                  sx={{ mt: 1.5, textTransform: "none" }}
                >
                  {translated.loginInstead}
                </Button>
              </form>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
