import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
}) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    // Get saved theme from localStorage or detect system preference
    const savedTheme = localStorage.getItem("theme") as PaletteMode;
    if (savedTheme) {
      return savedTheme;
    }

    // Detect system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "light" ? "#6366f1" : "#818cf8",
        light: mode === "light" ? "#818cf8" : "#a5b4fc",
        dark: mode === "light" ? "#4f46e5" : "#6366f1",
      },
      secondary: {
        main: mode === "light" ? "#ec4899" : "#f472b6",
        light: mode === "light" ? "#f472b6" : "#f9a8d4",
        dark: mode === "light" ? "#db2777" : "#ec4899",
      },
      background: {
        default: mode === "light" ? "#ffffff" : "#0f172a",
        paper: mode === "light" ? "#ffffff" : "#1e293b",
      },
      text: {
        primary: mode === "light" ? "#1f2937" : "#f1f5f9",
        secondary: mode === "light" ? "#6b7280" : "#94a3b8",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#ffffff" : "rgba(30, 41, 59, 0.8)",
            backdropFilter: mode === "dark" ? "blur(10px)" : "none",
            border: mode === "dark" ? "1px solid rgba(148, 163, 184, 0.1)" : "none",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: mode === "light" 
                ? "0 12px 24px rgba(0,0,0,0.1)" 
                : "0 12px 24px rgba(0,0,0,0.3)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#ffffff" : "rgba(30, 41, 59, 0.8)",
            backdropFilter: mode === "dark" ? "blur(10px)" : "none",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === "light" 
              ? "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)"
              : "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: mode === "light"
              ? "0 4px 6px rgba(0,0,0,0.1)"
              : "0 4px 6px rgba(0,0,0,0.3)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 8,
          },
          contained: {
            background: mode === "light"
              ? "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)"
              : "linear-gradient(135deg, #818cf8 0%, #60a5fa 100%)",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(99, 102, 241, 0.4)",
              transform: "translateY(-2px)",
            },
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            background: mode === "light"
              ? "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)"
              : "linear-gradient(135deg, #818cf8 0%, #60a5fa 100%)",
            boxShadow: "0 8px 16px rgba(99, 102, 241, 0.3)",
            "&:hover": {
              boxShadow: "0 12px 24px rgba(99, 102, 241, 0.4)",
              transform: "scale(1.05)",
            },
          },
        },
      },
    },
  });

  const value = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
