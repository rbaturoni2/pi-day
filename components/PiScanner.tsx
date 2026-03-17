'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import PiTriviaComponent from './PiTrivia';

interface PiScannerProps {
  piDigits: string;
  targetPosition: number; // 1-indexed
  searchString: string;
  onComplete: () => void;
}

// Easing function: ease-in-out cubic
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Dramatic easing: starts slow, rockets, then decelerates hard
function dramaticEase(t: number): number {
  if (t < 0.25) {
    // Slow start: ease-in
    return (t / 0.25) * (t / 0.25) * 0.1;
  } else if (t < 0.75) {
    // Rocket phase
    const localT = (t - 0.25) / 0.5;
    return 0.1 + localT * localT * 0.75;
  } else {
    // Decelerate dramatically
    const localT = (t - 0.75) / 0.25;
    return 0.85 + easeInOutCubic(localT) * 0.15;
  }
}

const VISIBLE_DIGITS = 42;
const TOTAL_DURATION = 4200; // ms

export default function PiScanner({ piDigits, targetPosition, searchString, onComplete }: PiScannerProps) {
  const [displayDigits, setDisplayDigits] = useState('');
  const [scanPosition, setScanPosition] = useState(0);
  const [phase, setPhase] = useState<'scanning' | 'found'>('scanning');
  const [scannerX, setScannerX] = useState(0); // 0-100%
  const [isTriviaActive, setIsTriviaActive] = useState(true);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  // The actual 0-indexed position in piDigits
  const targetIdx = targetPosition - 1;

  const getDigitsAtPosition = useCallback((pos: number): string => {
    // pos = 0-indexed position in piDigits
    const halfVisible = Math.floor(VISIBLE_DIGITS / 2);
    const start = Math.max(0, pos - halfVisible);
    const end = Math.min(piDigits.length, start + VISIBLE_DIGITS);
    return piDigits.slice(start, end);
  }, [piDigits]);

  useEffect(() => {
    if (completedRef.current) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / TOTAL_DURATION, 1);

      const easedT = dramaticEase(t);
      const currentPos = Math.floor(easedT * targetIdx);

      setScanPosition(currentPos + 1); // 1-indexed for display
      setDisplayDigits(getDigitsAtPosition(currentPos));

      // Scanner line sweeps faster in rocket phase
      if (t < 0.25) {
        setScannerX(t * 4 * 40); // 0 to 40%
      } else if (t < 0.75) {
        const localT = (t - 0.25) / 0.5;
        setScannerX(40 + localT * 50); // 40% to 90%
      } else {
        const localT = (t - 0.75) / 0.25;
        setScannerX(90 + localT * 10); // 90% to 100%
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        completedRef.current = true;
        setScanPosition(targetPosition);
        setDisplayDigits(getDigitsAtPosition(targetIdx));
        setScannerX(100);
        setPhase('found');
        setIsTriviaActive(false);

        // Brief pause then fire onComplete
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [targetIdx, targetPosition, getDigitsAtPosition, onComplete]);

  // Build highlighted digit display for "found" phase
  const renderDigits = () => {
    if (phase === 'found') {
      const halfVisible = Math.floor(VISIBLE_DIGITS / 2);
      const start = Math.max(0, targetIdx - halfVisible);
      const digits = getDigitsAtPosition(targetIdx);
      const matchStart = targetIdx - start;
      const matchEnd = matchStart + searchString.length;

      return (
        <Box
          component="span"
          sx={{ fontFamily: '"Orbitron", "Space Mono", monospace', letterSpacing: '0.1em' }}
        >
          <Box component="span" sx={{ color: '#6b6b8a' }}>
            {digits.slice(0, matchStart)}
          </Box>
          <Box
            component="span"
            sx={{
              color: '#ffd600',
              animation: 'match-glow 1.5s ease-in-out infinite',
              fontWeight: 900,
              fontSize: '1.1em',
            }}
          >
            {digits.slice(matchStart, matchEnd)}
          </Box>
          <Box component="span" sx={{ color: '#6b6b8a' }}>
            {digits.slice(matchEnd)}
          </Box>
        </Box>
      );
    }

    return (
      <Box
        component="span"
        sx={{
          fontFamily: '"Orbitron", "Space Mono", monospace',
          letterSpacing: '0.1em',
          color: '#8888aa',
        }}
      >
        {displayDigits}
      </Box>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 700,
          mx: 'auto',
          px: { xs: 1, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* Header */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Orbitron", monospace',
            color: phase === 'found' ? '#ffd600' : '#00e5ff',
            fontSize: { xs: '1rem', sm: '1.2rem' },
            textAlign: 'center',
            textShadow: phase === 'found'
              ? '0 0 20px rgba(255, 214, 0, 0.6)'
              : '0 0 20px rgba(0, 229, 255, 0.6)',
            transition: 'all 0.5s',
            animation: phase === 'found' ? 'none' : 'flicker 1.8s ease-in-out infinite',
          }}
        >
          {phase === 'found' ? '⚡ MATCH FOUND ⚡' : '◈ SCANNING PI ◈'}
        </Typography>

        {/* Digit stream container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            background: 'rgba(13, 13, 26, 0.9)',
            border: `2px solid ${phase === 'found' ? 'rgba(255, 214, 0, 0.6)' : 'rgba(0, 229, 255, 0.25)'}`,
            borderRadius: 2,
            overflow: 'hidden',
            py: 2,
            px: { xs: 1, sm: 2 },
            transition: 'border-color 0.5s',
            boxShadow: phase === 'found'
              ? '0 0 30px rgba(255, 214, 0, 0.2), inset 0 0 30px rgba(255, 214, 0, 0.05)'
              : '0 0 20px rgba(0, 229, 255, 0.1), inset 0 0 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Scanning line */}
          {phase === 'scanning' && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '3px',
                background: 'linear-gradient(to bottom, transparent, #00e5ff, #6effff, #00e5ff, transparent)',
                boxShadow: '0 0 12px #00e5ff, 0 0 24px rgba(0, 229, 255, 0.5)',
                left: `${scannerX}%`,
                transition: 'left 0.05s linear',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Digit display */}
          <Typography
            component="div"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
              wordBreak: 'break-all',
              textAlign: 'center',
              lineHeight: 1.8,
              minHeight: '2.5em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
              filter: phase === 'scanning' && scannerX > 40
                ? 'blur(0.5px)'
                : 'none',
              transition: 'filter 0.1s',
            }}
          >
            {renderDigits()}
          </Typography>
        </Box>

        {/* Position counter */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            background: 'rgba(13, 13, 26, 0.6)',
            border: '1px solid rgba(0, 229, 255, 0.1)',
            borderRadius: 2,
            px: 3,
            py: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#6b6b8a', fontFamily: '"DM Sans", sans-serif' }}
          >
            {phase === 'found' ? 'Found at position:' : 'Scanning position:'}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Orbitron", monospace',
              color: phase === 'found' ? '#ffd600' : '#00e5ff',
              fontSize: { xs: '1rem', sm: '1.2rem' },
              fontWeight: 700,
              textShadow: phase === 'found'
                ? '0 0 12px rgba(255, 214, 0, 0.7)'
                : '0 0 10px rgba(0, 229, 255, 0.6)',
              minWidth: '120px',
              animation: phase === 'scanning' ? 'count-up 0.1s ease-out' : 'none',
            }}
          >
            {scanPosition.toLocaleString('en-US')}
          </Typography>
        </Box>

        {/* Progress bar */}
        {phase === 'scanning' && (
          <Box
            sx={{
              width: '100%',
              height: 4,
              background: 'rgba(0, 229, 255, 0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${(scanPosition / targetPosition) * 100}%`,
                background: 'linear-gradient(90deg, #00e5ff, #6effff)',
                boxShadow: '0 0 8px rgba(0, 229, 255, 0.6)',
                borderRadius: 2,
                transition: 'width 0.1s linear',
              }}
            />
          </Box>
        )}

        {/* Target hint */}
        {phase === 'scanning' && (
          <Typography
            variant="caption"
            sx={{
              color: '#6b6b8a',
              fontFamily: '"DM Sans", sans-serif',
              textAlign: 'center',
            }}
          >
            Searching for <strong style={{ color: '#00e5ff', fontFamily: '"Orbitron", monospace' }}>{searchString}</strong> in {(1000000).toLocaleString('en-US')} digits of π
          </Typography>
        )}

        {/* Trivia */}
        <PiTriviaComponent isActive={isTriviaActive} intervalMs={1500} />
      </Box>
    </motion.div>
  );
}
