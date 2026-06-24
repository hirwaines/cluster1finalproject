import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FlaskConical } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showText?: boolean;
}

const sizes = {
  sm: { icon: 28, fontSize: '1rem',    iconSize: 15 },
  md: { icon: 36, fontSize: '1.125rem', iconSize: 19 },
  lg: { icon: 44, fontSize: '1.375rem', iconSize: 23 },
};

export function Logo({ size = 'md', onClick, showText = true }: LogoProps) {
  const s = sizes[size];

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Icon mark */}
      <Box
        sx={{
          width: s.icon,
          height: s.icon,
          borderRadius: '8px',
          backgroundColor: '#1E40AF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <FlaskConical size={s.iconSize} color="#FFFFFF" strokeWidth={2} />
      </Box>

      {/* Wordmark */}
      {showText && (
        <Typography
          sx={{
            fontSize: s.fontSize,
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '-0.3px',
            lineHeight: 1,
          }}
        >
          Research
          <Box component="span" sx={{ color: '#1E40AF' }}>IQ</Box>
        </Typography>
      )}
    </Box>
  );
}
