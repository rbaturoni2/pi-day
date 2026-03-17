'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { AnimatePresence, motion } from 'framer-motion';

import PiBackground from '@/components/PiBackground';
import BirthdayInput from '@/components/BirthdayInput';
import PiScanner from '@/components/PiScanner';
import ResultCard from '@/components/ResultCard';
import ParticleExplosion from '@/components/ParticleExplosion';
import { searchPi, formatBirthdaySearchStrings, PiSearchResult } from '@/lib/piSearch';

type AppState = 'landing' | 'input' | 'scanning' | 'result' | 'not-found';

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

const pageTransition = { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [piDigits, setPiDigits] = useState<string>('');
  const [searchResult, setSearchResult] = useState<PiSearchResult | null>(null);
  const [scanTarget, setScanTarget] = useState<{ position: number; searchString: string } | null>(null);
  const [isLoadingPi, setIsLoadingPi] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [birthdayDate, setBirthdayDate] = useState<Date | null>(null);

  const handleScan = useCallback(async (date: Date) => {
    setBirthdayDate(date);
    setIsLoadingPi(true);

    try {
      let digits = piDigits;

      if (!digits) {
        const response = await fetch('/pi-million.txt');
        if (!response.ok) throw new Error('Failed to load Pi digits');
        digits = await response.text();
        setPiDigits(digits.trim());
        digits = digits.trim();
      }

      const result = searchPi(digits, date);

      if (result && result.found) {
        setSearchResult(result);
        setScanTarget({ position: result.position, searchString: result.searchString });
        setAppState('scanning');
      } else {
        setSearchResult(null);
        setScanTarget(null);
        setAppState('not-found');
      }
    } catch (error) {
      console.error('Error loading Pi digits:', error);
      setAppState('not-found');
    } finally {
      setIsLoadingPi(false);
    }
  }, [piDigits]);

  const handleScanComplete = useCallback(() => {
    setShowParticles(true);
    setAppState('result');
    setTimeout(() => setShowParticles(false), 2500);
  }, []);

  const handleReset = useCallback(() => {
    setShowParticles(false);
    setSearchResult(null);
    setScanTarget(null);
    setBirthdayDate(null);
    setAppState('input');
  }, []);

  const handleStart = useCallback(() => {
    setAppState('input');
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#06060e',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background */}
      <PiBackground />

      {/* Radial gradient overlay for depth */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, rgba(6, 6, 14, 0.6) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Particles */}
      <ParticleExplosion active={showParticles} />

      {/* Main content */}
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 10,
          py: { xs: 4, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence mode="wait">

          {/* === LANDING SCREEN === */}
          {appState === 'landing' && (
            <motion.div
              key="landing"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              style={{ width: '100%', textAlign: 'center' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  px: 2,
                }}
              >
                {/* Giant Pi Symbol */}
                <Box
                  className="pi-symbol"
                  sx={{
                    fontSize: { xs: '7rem', sm: '10rem', md: '13rem' },
                    lineHeight: 1,
                    mb: 1,
                  }}
                >
                  π
                </Box>

                {/* Title */}
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: '"Orbitron", monospace',
                    fontSize: { xs: '1.6rem', sm: '2.3rem', md: '3rem' },
                    fontWeight: 800,
                    color: '#e8e8f0',
                    textShadow: '0 0 30px rgba(0, 229, 255, 0.4), 0 0 60px rgba(0, 229, 255, 0.15)',
                    lineHeight: 1.2,
                    mb: 1,
                  }}
                >
                  Find Your Birthday
                  <Box component="span" sx={{ color: '#00e5ff', display: 'block' }}>
                    in Pi
                  </Box>
                </Typography>

                {/* Subtitle */}
                <Typography
                  variant="body1"
                  sx={{
                    color: '#6b6b8a',
                    maxWidth: 520,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: 1.7,
                    textAlign: 'center',
                  }}
                >
                  March 14 — Happy Pi Day! 🥧
                  <br />
                  Your birthday is hidden somewhere in the infinite digits of π.
                  <br />
                  <Box component="span" sx={{ color: '#e8e8f0', fontStyle: 'italic' }}>
                    Let&apos;s find it.
                  </Box>
                </Typography>

                {/* CTA Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleStart}
                  sx={{
                    mt: 2,
                    px: { xs: 4, sm: 6 },
                    py: 2,
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    background: 'linear-gradient(135deg, #00e5ff 0%, #0097a7 100%)',
                    color: '#06060e',
                    borderRadius: 3,
                    animation: 'button-pulse 2s ease-in-out infinite',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6effff 0%, #00e5ff 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 40px rgba(0, 229, 255, 0.5)',
                    },
                    transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
                  }}
                >
                  Enter Your Birthday →
                </Button>

                {/* Pi Day badge */}
                <Box
                  sx={{
                    mt: 2,
                    px: 2,
                    py: 0.75,
                    border: '1px solid rgba(0, 229, 255, 0.15)',
                    borderRadius: 6,
                    background: 'rgba(0, 229, 255, 0.04)',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#6b6b8a',
                      fontFamily: '"Orbitron", monospace',
                      letterSpacing: '0.1em',
                    }}
                  >
                    1,000,000 DIGITS OF π • PI DAY 2026
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* === INPUT SCREEN === */}
          {appState === 'input' && (
            <motion.div
              key="input"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              style={{ width: '100%' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                {/* Small π header */}
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    className="pi-symbol"
                    sx={{
                      fontSize: { xs: '3rem', sm: '4.5rem' },
                      display: 'block',
                      mb: 1,
                    }}
                  >
                    π
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: '#6b6b8a', fontStyle: 'italic' }}
                  >
                    Your birthday is hiding somewhere in π. Let&apos;s find it.
                  </Typography>
                </Box>

                <BirthdayInput onScan={handleScan} isLoading={isLoadingPi} />

                <Button
                  variant="text"
                  onClick={() => setAppState('landing')}
                  sx={{
                    color: '#6b6b8a',
                    fontSize: '0.8rem',
                    '&:hover': { color: '#00e5ff' },
                    transition: 'color 0.2s',
                  }}
                >
                  ← Back
                </Button>
              </Box>
            </motion.div>
          )}

          {/* === SCANNING SCREEN === */}
          {appState === 'scanning' && scanTarget && (
            <motion.div
              key="scanning"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              style={{ width: '100%' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                {/* Small π header */}
                <Typography
                  className="pi-symbol"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem' },
                  }}
                >
                  π
                </Typography>

                <PiScanner
                  piDigits={piDigits}
                  targetPosition={scanTarget.position}
                  searchString={scanTarget.searchString}
                  onComplete={handleScanComplete}
                />
              </Box>
            </motion.div>
          )}

          {/* === RESULT SCREEN === */}
          {appState === 'result' && searchResult && (
            <motion.div
              key="result"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              style={{ width: '100%' }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <ResultCard result={searchResult} onReset={handleReset} />

                {/* Pi trivia footer */}
                <Typography
                  variant="caption"
                  sx={{
                    color: '#6b6b8a',
                    textAlign: 'center',
                    mt: 1,
                    fontStyle: 'italic',
                  }}
                >
                  Happy Pi Day, March 14, 2026 🥧
                </Typography>
              </Box>
            </motion.div>
          )}

          {/* === NOT FOUND SCREEN === */}
          {appState === 'not-found' && (
            <motion.div
              key="not-found"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              style={{ width: '100%' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  textAlign: 'center',
                  maxWidth: 500,
                  mx: 'auto',
                  px: 2,
                }}
              >
                <Typography sx={{ fontSize: '4rem' }}>😏</Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Orbitron", monospace',
                    color: '#ff2d7b',
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    textShadow: '0 0 20px rgba(255, 45, 123, 0.5)',
                  }}
                >
                  One in a Million
                </Typography>

                <Typography
                  sx={{
                    color: '#6b6b8a',
                    lineHeight: 1.8,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  Your full birthday wasn&apos;t found in the first 1,000,000 digits of π...
                  but you&apos;re clearly{' '}
                  <Box component="span" sx={{ color: '#ff2d7b', fontWeight: 700 }}>
                    one in a million
                  </Box>{' '}
                  😏
                  <br /><br />
                  {birthdayDate && (
                    <>
                      We searched for{' '}
                      {formatBirthdaySearchStrings(birthdayDate).map(f => (
                        <Box
                          key={f.format}
                          component="span"
                          sx={{
                            fontFamily: '"Orbitron", monospace',
                            color: '#00e5ff',
                            fontSize: '0.85em',
                            mx: 0.5,
                          }}
                        >
                          {f.value}
                        </Box>
                      ))}
                      {' '}— none were found.
                    </>
                  )}
                </Typography>

                <Button
                  variant="contained"
                  onClick={handleReset}
                  sx={{
                    background: 'linear-gradient(135deg, #ff2d7b 0%, #c2185b 100%)',
                    color: '#fff',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: 700,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ff6faa 0%, #ff2d7b 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(255, 45, 123, 0.4)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Try Another Birthday
                </Button>

                <Button
                  variant="text"
                  onClick={() => setAppState('landing')}
                  sx={{
                    color: '#6b6b8a',
                    fontSize: '0.8rem',
                    '&:hover': { color: '#00e5ff' },
                  }}
                >
                  ← Back to Start
                </Button>
              </Box>
            </motion.div>
          )}

        </AnimatePresence>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(107, 107, 138, 0.5)',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
          }}
        >
          Built for Pi Day 2026 · Roberto Baturoni / Oddiyana Consulting
        </Typography>
      </Box>
    </Box>
  );
}
