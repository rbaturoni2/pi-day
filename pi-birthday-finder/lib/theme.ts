'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#06060e',
      paper: '#0d0d1a',
    },
    primary: {
      main: '#00e5ff',
      light: '#6effff',
    },
    secondary: {
      main: '#ff2d7b',
      light: '#ff6faa',
    },
    warning: {
      main: '#ffd600',
    },
    text: {
      primary: '#e8e8f0',
      secondary: '#6b6b8a',
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Outfit", sans-serif',
    h1: {
      fontFamily: '"Orbitron", monospace',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Orbitron", monospace',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Orbitron", monospace',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Orbitron", monospace',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.02em',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
