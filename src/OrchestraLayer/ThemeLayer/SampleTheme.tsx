import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ThemeProvider,
  Button,
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";

// Type definitions for better TypeScript support
interface ThemeMode {
  mode: 'light' | 'dark';
  toggleThemeMode: () => void;
}

// Create a Theme Mode Context
const ThemeModeContext = createContext<ThemeMode | null>(null);

// Custom hook to easily consume the theme mode context
export const useThemeMode = (): ThemeMode => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};

// Custom theme configuration for Material Tailwind
const customTheme = {
  button: {
    defaultProps: {
      size: "md",
      variant: "filled",
      color: "blue",
      fullWidth: false,
      ripple: false,
    },
    styles: {
      base: {
        initial: {
          verticalAlign: "align-middle",
          userSelect: "select-none",
          fontFamily: "font-sans",
          fontWeight: "font-bold",
          textAlign: "text-center",
          textTransform: "uppercase",
          transition: "transition-all",
          disabled: "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          borderRadius: "rounded-full",
          padding: "px-6 py-3",
        },
        variants: {
          filled: {
            blue: {
              background: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
              color: "text-white",
              shadow: "shadow-none",
            },
            purple: {
              background: "bg-purple-500 hover:bg-purple-600 active:bg-purple-700",
              color: "text-white",
              shadow: "shadow-none",
            },
          },
        },
      },
    },
  },
  card: {
    defaultProps: {
      variant: "filled",
      color: "white",
      shadow: false,
    },
    styles: {
      base: {
        initial: {
          position: "relative",
          display: "flex",
          flexDirection: "flex-col",
          backgroundClip: "bg-clip-border",
          borderRadius: "rounded-xl border border-gray-200 dark:border-gray-700",
        },
        variants: {
          filled: {
            white: {
              background: "bg-white dark:bg-gray-800",
              color: "text-gray-700 dark:text-gray-200",
              shadow: "shadow-none",
            },
          },
        },
      },
    },
  },
};

const commonProps = {
  placeholder: undefined,
  onPointerEnterCapture: undefined,
  onPointerLeaveCapture: undefined,
  onResize: undefined,
  onResizeCapture: undefined,
} as any;

// Main App Component
export default function App() {
  // Initialize theme mode from localStorage or default to 'light'
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('themeMode');
      return (storedMode as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  // Effect to save the theme mode to localStorage and update document class
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', mode);

      // Add or remove dark class from document element
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [mode]);

  // Function to toggle the theme mode
  const toggleThemeMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Memoize the context value
  const contextValue = useMemo(() => ({ mode, toggleThemeMode }), [mode]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider value={customTheme}>
        <div className={`min-h-screen transition-colors duration-300 ${mode === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-gray-50 text-gray-900'
          }`}>
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Typography
              variant="h1"
              className="mb-8 text-center font-bold text-4xl md:text-5xl text-gray-900 dark:text-white"
              {...commonProps}
            >
              Material Tailwind Theme Manager
            </Typography>

            <ThemeToggler />
            <ContentSection />
          </div>
        </div>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

// Component to toggle the theme
const ThemeToggler = () => {
  const { mode, toggleThemeMode } = useThemeMode();

  return (
    <div className="mb-8">
      <Button
        onClick={toggleThemeMode}
        className={`transition-all duration-300 transform ${mode === 'dark'
          ? 'bg-purple-600 hover:bg-purple-700'
          : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold py-3 px-6 rounded-full`}
        ripple={false}
        {...commonProps}
      >
        🌙 Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode ☀️
      </Button>
    </div>
  );
};

// Component that consumes the theme
const ContentSection = () => {
  const { mode } = useThemeMode();

  return (
    <Card
      className={`w-full max-w-lg transition-all duration-300 ${mode === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
        }`}
      {...commonProps}
    >
      <CardBody className="text-center p-8" {...commonProps}>
        <Typography
          variant="h3"
          className={`mb-4 font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          {...commonProps}
        >
          Current Theme:
          <span className={`ml-2 capitalize ${mode === 'dark'
            ? 'text-purple-400'
            : 'text-blue-600'
            }`}>
            {mode}
          </span>
        </Typography>

        <Typography
          variant="paragraph"
          className={`mb-6 leading-relaxed ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          {...commonProps}
        >
          This content dynamically changes its appearance based on the selected theme.
          Observe the background, text color, and button style adapting smoothly with Tailwind CSS transitions.
        </Typography>

        <div className={`mt-4 p-4 rounded-lg border-l-4 ${mode === 'dark'
          ? 'bg-gray-700 border-purple-500 text-gray-200'
          : 'bg-blue-50 border-blue-500 text-gray-700'
          }`}>
          <Typography variant="small" className="font-medium" {...commonProps}>
            💡 Pro Tip: You can extend this theming system to any component in your app using Tailwind CSS classes and the dark: modifier!
          </Typography>
        </div>

        {/* Demo color palette */}
        <div className="flex justify-center gap-3 mt-6">
          <div className={`w-8 h-8 rounded-full ${mode === 'dark' ? 'bg-purple-500' : 'bg-blue-500'
            }`}></div>
          <div className={`w-8 h-8 rounded-full ${mode === 'dark' ? 'bg-purple-400' : 'bg-blue-400'
            }`}></div>
          <div className={`w-8 h-8 rounded-full ${mode === 'dark' ? 'bg-purple-300' : 'bg-blue-300'
            }`}></div>
          <div className={`w-8 h-8 rounded-full ${mode === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
            }`}></div>
        </div>
      </CardBody>
    </Card>
  );
};