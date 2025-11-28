import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(210, 80%, 56%)',
      light: 'hsl(210, 85%, 92%)',
      dark: 'hsl(210, 80%, 48%)',
      contrastText: '#ffffff',
    },
    secondary: {
      main: 'hsl(150, 60%, 45%)',
      light: 'hsl(150, 55%, 92%)',
      dark: 'hsl(150, 60%, 38%)',
      contrastText: '#ffffff',
    },
    success: {
      main: 'hsl(140, 70%, 45%)',
      light: 'hsl(140, 65%, 92%)',
      dark: 'hsl(140, 70%, 38%)',
    },
    warning: {
      main: 'hsl(38, 92%, 50%)',
      light: 'hsl(38, 90%, 92%)',
      dark: 'hsl(38, 92%, 42%)',
    },
    error: {
      main: 'hsl(0, 84%, 60%)',
      light: 'hsl(0, 80%, 95%)',
      dark: 'hsl(0, 84%, 52%)',
    },
    background: {
      default: 'hsl(210, 20%, 98%)',
      paper: '#ffffff',
    },
    text: {
      primary: 'hsl(215, 25%, 27%)',
      secondary: 'hsl(215, 16%, 47%)',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.25rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 500,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
