import { createTheme } from "@mui/material/styles";

// ── Shared typography & shape ────────────────────────────────────────────────
const baseTypography = {
  fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
  h1: { fontWeight: 800 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 700 },
  h4: { fontWeight: 700 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  button: { fontWeight: 600, letterSpacing: 0.3 },
};

// ── Light Theme ──────────────────────────────────────────────────────────────
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5",
      dark: "#3730A3",
      light: "#818CF8",
      contrastText: "#fff",
    },
    secondary: {
      main: "#F59E0B",
      contrastText: "#fff",
    },
    background: {
      default: "#F5F6FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
    success: { main: "#10B981" },
    divider: "#E5E7EB",
  },
  typography: baseTypography,
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #3730A3 0%, #6D28D9 100%)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 25px 60px rgba(79,70,229,0.15)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4F46E5",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4F46E5",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid #E5E7EB",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          boxShadow: "0 2px 20px rgba(79,70,229,0.3)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: "0.75rem",
          background: "#1E1B4B",
        },
      },
    },
  },
});

// ── Dark Theme ───────────────────────────────────────────────────────────────
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#818CF8",
      dark: "#4F46E5",
      light: "#A5B4FC",
      contrastText: "#fff",
    },
    secondary: {
      main: "#F59E0B",
      contrastText: "#fff",
    },
    background: {
      default: "#0F0F1A",
      paper: "#1A1B2E",
    },
    text: {
      primary: "#F1F0FF",
      secondary: "#8B8FA8",
    },
    success: { main: "#10B981" },
    divider: "#2D2F4A",
  },
  typography: baseTypography,
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #3730A3 0%, #6D28D9 100%)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1A1B2E",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          backgroundColor: "#1A1B2E",
          border: "1px solid #2D2F4A",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#0F0F1A",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#818CF8",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#818CF8",
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: "2px solid #2D2F4A",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #2D2860 0%, #3D1F7A 100%)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: "0.75rem",
          background: "#0F0F1A",
          border: "1px solid #2D2F4A",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundColor: "#14152A", borderRight: "1px solid #2D2F4A" },
      },
    },
  },
});
