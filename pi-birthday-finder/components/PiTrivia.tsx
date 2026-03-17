'use client';

import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import { getShuffledTrivia, PiTrivia } from '@/lib/piTrivia';

interface PiTriviaProps {
  isActive: boolean;
  intervalMs?: number;
}

export default function PiTriviaComponent({ isActive, intervalMs = 1500 }: PiTriviaProps) {
  const [currentFact, setCurrentFact] = useState<PiTrivia | null>(null);
  const [factKey, setFactKey] = useState(0);
  const triviaQueueRef = useRef<PiTrivia[]>([]);
  const indexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      // Initialize shuffled queue
      triviaQueueRef.current = getShuffledTrivia();
      indexRef.current = 0;

      // Show first fact immediately
      setCurrentFact(triviaQueueRef.current[0]);
      setFactKey((k) => k + 1);

      // Start cycling
      intervalRef.current = setInterval(() => {
        indexRef.current = (indexRef.current + 1) % triviaQueueRef.current.length;
        // Reshuffle when we loop back
        if (indexRef.current === 0) {
          triviaQueueRef.current = getShuffledTrivia();
        }
        setCurrentFact(triviaQueueRef.current[indexRef.current]);
        setFactKey((k) => k + 1);
      }, intervalMs);
    } else {
      // Stop cycling
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Fade out gracefully
      setTimeout(() => setCurrentFact(null), 300);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, intervalMs]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 72,
        px: 2,
        mt: 3,
      }}
    >
      <AnimatePresence mode="wait">
        {currentFact && (
          <motion.div
            key={factKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ width: '100%', maxWidth: 520 }}
          >
            <Box
              sx={{
                background: 'rgba(13, 13, 26, 0.7)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(0, 229, 255, 0.1)',
                borderRadius: '24px',
                px: { xs: 2, sm: 3 },
                py: 1.5,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
              }}
            >
              <Typography
                component="span"
                sx={{
                  color: '#00e5ff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  mt: '1px',
                  flexShrink: 0,
                  textShadow: '0 0 8px rgba(0, 229, 255, 0.6)',
                }}
              >
                π
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b6b8a',
                  fontStyle: 'italic',
                  fontSize: { xs: '0.78rem', sm: '0.85rem' },
                  lineHeight: 1.5,
                  fontFamily: '"DM Sans", sans-serif',
                }}
              >
                {currentFact.fact}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
