"use client";

import { createTheme } from "@mui/material/styles";

export const darkGlassTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0b0f19",
      paper: "rgba(255, 255, 255, 0.08)",
    },
    primary: {
      main: "#6366f1",
    },
  },

  // ✅ ADD THIS
  typography: {
    fontFamily: `"Sora", system-ui, -apple-system, BlinkMacSystemFont, sans-serif`,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at top, #111827, #020617)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.12)",
          backgroundImage: "none",
        },
      },
    },
  },
});
