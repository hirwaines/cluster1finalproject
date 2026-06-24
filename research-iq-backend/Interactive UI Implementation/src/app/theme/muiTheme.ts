import { createTheme } from '@mui/material/styles';

/**
 * ResearchIQ Design System — 3 core colors
 *
 * 1. Navy Blue  #1E40AF  — Primary brand, actions, links
 * 2. Emerald    #065F46  — Funding, success, secondary
 * 3. White      #FFFFFF  — Backgrounds
 *
 * No gradients in component-level UI — gradients only for landing hero.
 * This keeps the platform looking institutional rather than AI-generated.
 */

export const COLORS = {
  navy: {
    50:  '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF', // ← PRIMARY BRAND
    900: '#1E3A8A',
  },
  emerald: {
    50:  '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857', // ← SECONDARY BRAND
    800: '#065F46', // ← SECONDARY DARK
    900: '#064E3B',
  },
  slate: {
    50:  '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A', // ← TEXT
  },
};

export const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:         COLORS.navy[800],
      light:        COLORS.navy[600],
      dark:         COLORS.navy[900],
      contrastText: '#ffffff',
    },
    secondary: {
      main:         COLORS.emerald[700],
      light:        COLORS.emerald[500],
      dark:         COLORS.emerald[800],
      contrastText: '#ffffff',
    },
    error:   { main: '#DC2626', light: '#F87171', dark: '#B91C1C' },
    warning: { main: '#D97706', light: '#FCD34D', dark: '#B45309' },
    info:    { main: COLORS.navy[600] },
    success: { main: COLORS.emerald[600] },
    background: {
      default: '#FFFFFF',
      paper:   '#FFFFFF',
    },
    text: {
      primary:   COLORS.slate[900],
      secondary: COLORS.slate[500],
      disabled:  COLORS.slate[400],
    },
    divider: COLORS.slate[200],
    grey: {
      50:  COLORS.slate[50],
      100: COLORS.slate[100],
      200: COLORS.slate[200],
      300: COLORS.slate[300],
      400: COLORS.slate[400],
      500: COLORS.slate[500],
      600: COLORS.slate[600],
      700: COLORS.slate[700],
      800: COLORS.slate[800],
      900: COLORS.slate[900],
    },
  },

  spacing: 8, // 8px base grid

  shape: { borderRadius: 8 },

  typography: {
    fontFamily: '"Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
    fontWeightLight:   300,
    fontWeightRegular: 400,
    fontWeightMedium:  500,
    fontWeightBold:    700,
    htmlFontSize: 16,

    h1: { fontSize: '2.25rem',   fontWeight: 700, lineHeight: 1.2,   letterSpacing: '-0.5px' },
    h2: { fontSize: '1.875rem',  fontWeight: 700, lineHeight: 1.25,  letterSpacing: '-0.3px' },
    h3: { fontSize: '1.5rem',    fontWeight: 700, lineHeight: 1.3,   letterSpacing: '-0.2px' },
    h4: { fontSize: '1.25rem',   fontWeight: 600, lineHeight: 1.4,   letterSpacing: '-0.1px' },
    h5: { fontSize: '1.125rem',  fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1rem',      fontWeight: 600, lineHeight: 1.5 },

    subtitle1: { fontSize: '1rem',    fontWeight: 500, lineHeight: 1.5,   letterSpacing: '0.01em' },
    subtitle2: { fontSize: '0.875rem',fontWeight: 500, lineHeight: 1.57,  letterSpacing: '0.01em' },

    body1: { fontSize: '0.9375rem', fontWeight: 400, lineHeight: 1.6, letterSpacing: '0.01em' },
    body2: { fontSize: '0.875rem',  fontWeight: 400, lineHeight: 1.6, letterSpacing: '0.01em' },

    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
    caption: { fontSize: '0.75rem',   fontWeight: 400, lineHeight: 1.5, letterSpacing: '0.03em' },
    overline: { fontSize: '0.6875rem', fontWeight: 600, lineHeight: 1.5, letterSpacing: '0.08em', textTransform: 'uppercase' },
  },

  shadows: [
    'none',
    '0 1px 2px rgba(15,23,42,0.08)',
    '0 1px 4px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)',
    '0 2px 8px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)',
    '0 4px 12px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04)',
    '0 8px 16px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04)',
    '0 12px 24px rgba(15,23,42,0.08), 0 4px 8px rgba(15,23,42,0.04)',
    '0 16px 32px rgba(15,23,42,0.08), 0 4px 8px rgba(15,23,42,0.04)',
    ...Array(17).fill('0 16px 32px rgba(15,23,42,0.08), 0 4px 8px rgba(15,23,42,0.04)'),
  ] as any,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: {
          fontFamily: '"Roboto", "Inter", "Helvetica Neue", Arial, sans-serif',
          backgroundColor: '#FFFFFF',
          color: COLORS.slate[900],
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::-webkit-scrollbar': { width: 6, height: 6 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': { background: COLORS.slate[300], borderRadius: 3 },
        '::-webkit-scrollbar-thumb:hover': { background: COLORS.slate[400] },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '8px 20px',
          transition: 'all 0.15s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 2px 8px rgba(30,64,175,0.25)' },
        },
        containedPrimary: {
          backgroundColor: COLORS.navy[800],
          '&:hover': { backgroundColor: COLORS.navy[900] },
        },
        containedSecondary: {
          backgroundColor: COLORS.emerald[700],
          '&:hover': { backgroundColor: COLORS.emerald[800] },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px' },
        },
        outlinedPrimary: {
          borderColor: COLORS.navy[800],
          color: COLORS.navy[800],
          '&:hover': { bgcolor: COLORS.navy[50], borderColor: COLORS.navy[900] },
        },
        text: {
          '&:hover': { backgroundColor: COLORS.slate[100] },
        },
        sizeSmall:  { padding: '5px 14px', fontSize: '0.8125rem' },
        sizeLarge:  { padding: '11px 28px', fontSize: '1rem' },
      },
    },

    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          borderRadius: 12,
          borderColor: COLORS.slate[200],
          boxShadow: 'none',
          backgroundImage: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': { paddingBottom: 24 },
        },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: COLORS.slate[900],
          borderBottom: `1px solid ${COLORS.slate[200]}`,
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderColor: COLORS.slate[200],
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '1px 0',
          padding: '9px 14px',
          color: COLORS.slate[700],
          transition: 'background-color 0.15s, color 0.15s',
          '&:hover': {
            backgroundColor: COLORS.slate[100],
            color: COLORS.slate[900],
          },
          '&.Mui-selected': {
            backgroundColor: COLORS.navy[50],
            color: COLORS.navy[800],
            fontWeight: 600,
            '& .MuiListItemIcon-root': { color: COLORS.navy[800] },
            '&:hover': { backgroundColor: COLORS.navy[100] },
          },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 36, color: COLORS.slate[500] } },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 26,
        },
        colorPrimary: {
          backgroundColor: COLORS.navy[50],
          color: COLORS.navy[800],
        },
        colorSecondary: {
          backgroundColor: COLORS.emerald[50],
          color: COLORS.emerald[800],
        },
      },
    },

    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: COLORS.slate[50],
            '& fieldset': { borderColor: COLORS.slate[200] },
            '&:hover fieldset': { borderColor: COLORS.slate[400] },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              '& fieldset': { borderColor: COLORS.navy[800], borderWidth: 2 },
            },
          },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: '"Roboto", sans-serif', fontSize: '0.9375rem' },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: { borderColor: COLORS.slate[200] },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: COLORS.slate[200] } },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '6px 10px',
          backgroundColor: COLORS.slate[900],
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: { fontWeight: 700, fontSize: '0.6875rem', minWidth: 18, height: 18, padding: '0 4px' },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: { fontFamily: '"Roboto", sans-serif', fontWeight: 700 },
        colorDefault: { backgroundColor: COLORS.navy[100], color: COLORS.navy[800] },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9375rem',
          minHeight: 44,
          padding: '10px 20px',
          color: COLORS.slate[500],
          '&.Mui-selected': { color: COLORS.navy[800], fontWeight: 700 },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: { height: 2, borderRadius: '2px 2px 0 0', backgroundColor: COLORS.navy[800] },
      },
    },

    MuiSelect: {
      styleOverrides: {
        outlined: { borderRadius: 8 },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8 },
        standardInfo:    { backgroundColor: COLORS.navy[50],    color: COLORS.navy[800] },
        standardSuccess: { backgroundColor: COLORS.emerald[50], color: COLORS.emerald[800] },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, backgroundColor: COLORS.slate[200] },
        barColorPrimary: { backgroundColor: COLORS.navy[800] },
      },
    },
  },
});
