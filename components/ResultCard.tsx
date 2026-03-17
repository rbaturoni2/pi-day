'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { motion } from 'framer-motion';
import { PiSearchResult, formatNumber } from '@/lib/piSearch';

interface ResultCardProps {
  result: PiSearchResult;
  onReset: () => void;
}

const FORMAT_LABELS: Record<PiSearchResult['matchedFormat'], string> = {
  MMDDYYYY: 'Full Birthday (MM/DD/YYYY)',
  MMDDYY: 'Short Birthday (MM/DD/YY)',
  MMDD: 'Month + Day (MM/DD)',
};

const FORMAT_COLORS: Record<PiSearchResult['matchedFormat'], string> = {
  MMDDYYYY: '#ffd600',
  MMDDYY: '#00e5ff',
  MMDD: '#ff2d7b',
};

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const { context, matchIndexInContext, searchString, position, matchedFormat } = result;

  const before = context.slice(0, matchIndexInContext);
  const match = context.slice(matchIndexInContext, matchIndexInContext + searchString.length);
  const after = context.slice(matchIndexInContext + searchString.length);

  const resultText = `🥧 I found my birthday in Pi!
${searchString} (${FORMAT_LABELS[matchedFormat]}) appears at position ${formatNumber(position)} in π
That's ${formatNumber(position)} digits deep in the infinite decimal expansion of π!
Find yours at: piday.oddiyana.com`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = resultText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const accentColor = FORMAT_COLORS[matchedFormat];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          px: { xs: 1, sm: 2 },
        }}
      >
        <Card
          elevation={8}
          sx={{
            background: 'rgba(13, 13, 26, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${accentColor}33`,
            borderRadius: 3,
            boxShadow: `0 0 40px ${accentColor}22, 0 8px 40px rgba(0,0,0,0.5)`,
            overflow: 'visible',
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  mb: 1,
                  animation: 'float 3s ease-in-out infinite',
                  display: 'inline-block',
                }}
              >
                🎉
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Orbitron", monospace',
                  fontWeight: 800,
                  color: accentColor,
                  textShadow: `0 0 20px ${accentColor}80, 0 0 40px ${accentColor}40`,
                  fontSize: { xs: '1.3rem', sm: '1.7rem' },
                  mb: 0.5,
                }}
              >
                Birthday Found!
              </Typography>
              <Chip
                label={FORMAT_LABELS[matchedFormat]}
                size="small"
                sx={{
                  bgcolor: `${accentColor}18`,
                  color: accentColor,
                  border: `1px solid ${accentColor}44`,
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.75rem',
                }}
              />
            </Box>

            {/* Position display */}
            <Box
              sx={{
                background: 'rgba(0,0,0,0.3)',
                border: `1px solid ${accentColor}22`,
                borderRadius: 2,
                p: 2.5,
                mb: 3,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: '#6b6b8a', mb: 0.5 }}
              >
                Your birthday
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Orbitron", monospace',
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  fontWeight: 900,
                  color: accentColor,
                  textShadow: `0 0 15px ${accentColor}80`,
                  letterSpacing: '0.15em',
                  mb: 0.5,
                }}
              >
                {searchString}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b6b8a' }}>
                appears at position
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Orbitron", monospace',
                  fontSize: { xs: '1.8rem', sm: '2.4rem' },
                  fontWeight: 900,
                  color: '#e8e8f0',
                  textShadow: '0 0 20px rgba(232, 232, 240, 0.3)',
                  letterSpacing: '0.05em',
                }}
              >
                {formatNumber(position)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#6b6b8a', mt: 0.5, fontStyle: 'italic' }}
              >
                in the decimal expansion of π
              </Typography>
            </Box>

            {/* Context digit window */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#6b6b8a',
                  display: 'block',
                  mb: 1,
                  textAlign: 'center',
                }}
              >
                Surrounding digits in π:
              </Typography>
              <Box
                sx={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  p: { xs: 1.5, sm: 2 },
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': { height: 4 },
                  '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0, 229, 255, 0.3)' },
                }}
              >
                <Typography
                  component="div"
                  sx={{
                    fontFamily: '"Orbitron", "Space Mono", "Courier New", monospace',
                    fontSize: { xs: '0.85rem', sm: '1rem' },
                    letterSpacing: '0.12em',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    lineHeight: 2,
                  }}
                >
                  <Box component="span" sx={{ color: '#6b6b8a' }}>...{before}</Box>
                  <Box
                    component="span"
                    sx={{
                      color: accentColor,
                      fontWeight: 900,
                      fontSize: '1.15em',
                      textShadow: `0 0 12px ${accentColor}99`,
                      mx: '2px',
                      animation: 'match-glow 2s ease-in-out infinite',
                    }}
                  >
                    {match}
                  </Box>
                  <Box component="span" sx={{ color: '#6b6b8a' }}>{after}...</Box>
                </Typography>
              </Box>
            </Box>

            {/* Fun fact */}
            <Box
              sx={{
                background: `${accentColor}08`,
                border: `1px solid ${accentColor}20`,
                borderRadius: 2,
                p: 2,
                mb: 3,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#e8e8f0',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                }}
              >
                Your birthday is hiding{' '}
                <Box
                  component="span"
                  sx={{
                    color: accentColor,
                    fontWeight: 700,
                    fontFamily: '"Orbitron", monospace',
                  }}
                >
                  {formatNumber(position)}
                </Box>{' '}
                digits deep in the infinite decimal expansion of π 🥧
              </Typography>
            </Box>

            {/* Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Button
                variant="outlined"
                fullWidth
                onClick={onReset}
                sx={{
                  borderColor: 'rgba(0, 229, 255, 0.3)',
                  color: '#00e5ff',
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#00e5ff',
                    background: 'rgba(0, 229, 255, 0.08)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Try Another Birthday
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCopy}
                sx={{
                  background: copied
                    ? 'linear-gradient(135deg, #4caf50, #2e7d32)'
                    : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                  color: '#06060e',
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  fontFamily: '"Orbitron", monospace',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: `0 6px 20px ${accentColor}44`,
                  },
                }}
              >
                {copied ? '✓ Copied!' : '📋 Copy Result'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
}
