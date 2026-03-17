'use client';

import { useMemo } from 'react';
import Box from '@mui/material/Box';

const PI_DIGITS_SHORT =
  '14159265358979323846264338327950288419716939937510' +
  '58209749445923078164062862089986280348253421170679' +
  '82148086513282306647093844609550582231725359408128' +
  '48111745028410270193852110555964462294895493038196';

const NUM_COLUMNS = 20;

export default function PiBackground() {
  const columns = useMemo(() => {
    return Array.from({ length: NUM_COLUMNS }, (_, i) => {
      const duration = 6 + Math.random() * 10; // 6–16s
      const delay = -(Math.random() * duration); // negative delay for immediate start
      const left = (i / NUM_COLUMNS) * 100 + (Math.random() * 2 - 1);
      const opacity = 0.04 + Math.random() * 0.04; // 0.04–0.08
      const fontSize = 10 + Math.floor(Math.random() * 6); // 10–15px

      // Build a long column of digits
      const digitCount = 60;
      const startOffset = Math.floor(Math.random() * PI_DIGITS_SHORT.length);
      let digits = '';
      for (let j = 0; j < digitCount; j++) {
        digits += PI_DIGITS_SHORT[(startOffset + j) % PI_DIGITS_SHORT.length];
        if (j % 1 === 0) digits += '\n';
      }

      return { duration, delay, left, opacity, fontSize, digits, id: i };
    });
  }, []);

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {columns.map((col) => (
        <Box
          key={col.id}
          sx={{
            position: 'absolute',
            top: 0,
            left: `${col.left}%`,
            color: '#00e5ff',
            opacity: col.opacity,
            fontSize: `${col.fontSize}px`,
            fontFamily: '"Orbitron", monospace',
            fontWeight: 400,
            lineHeight: 1.6,
            whiteSpace: 'pre',
            willChange: 'transform',
            animation: `digit-fall ${col.duration}s linear ${col.delay}s infinite`,
            userSelect: 'none',
          }}
        >
          {col.digits}
        </Box>
      ))}
    </Box>
  );
}
