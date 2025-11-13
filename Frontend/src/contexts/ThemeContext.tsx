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
        main: mode === "light" ? "#1976d2" : "#90caf9",
      },
      secondary: {
        main: mode === "light" ? "#dc004e" : "#f48fb1",
      },
      background: {
        default: mode === "light" ? "#f5f5f5" : "#121212",
        paper: mode === "light" ? "#ffffff" : "#1e1e1e",
      },
      text: {
        primary: mode === "light" ? "#000000" : "#ffffff",
        secondary: mode === "light" ? "#666666" : "#aaaaaa",
      },
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#ffffff" : "#2d2d2d",
            "&:hover": {
              backgroundColor: mode === "light" ? "#fafafa" : "#353535",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#ffffff" : "#2d2d2d",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#1976d2" : "#1e1e1e",
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
