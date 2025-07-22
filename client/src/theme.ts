import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4A7B9D",
      light: "#7FA7C7",
      dark: "#2C5474",
    },
    secondary: {
      main: "#E88B6F",
      light: "#FFA994",
      dark: "#B05F4C",
    },
    background: {
      default: "#F3F7F0",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2C3E50",
      secondary: "#5D6D7E",
    },
    error: {
      main: "#D16B5F",
    },
    success: {
      main: "#7BAE7F",
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#2C3E50",
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#2C3E50",
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#4A7B9D",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #4A7B9D 30%, #7FA7C7 90%)",
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #E88B6F 30%, #FFA994 90%)",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (min-width: 1200px)": {
            maxWidth: 1400,
          },
        },
      },
    },
  },
});
