import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { lightTheme, darkTheme } from "./constants/theme.js";

// ── ThemeWrapper — reads localStorage so theme survives refresh ──────────────
const ThemeWrapper = () => {
  const [mode, setMode] = React.useState(
    () => localStorage.getItem("gt-theme") || "light"
  );

  // Expose toggle globally so Header can call it without prop-drilling
  React.useEffect(() => {
    window.__setGlobeTalkTheme = (m) => {
      setMode(m);
      localStorage.setItem("gt-theme", m);
    };
    window.__getGlobeTalkTheme = () => mode;
  }, [mode]);

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <div>
          <ThemeWrapper />
        </div>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);