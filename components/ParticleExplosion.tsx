'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  angle: number;
  distance: number;
  shape: 'circle' | 'square' | 'star';
}

const COLORS = [
  '#00e5ff', '#6effff', // cyan
  '#ff2d7b', '#ff6faa', // pink
  '#ffd600', '#ffe566', // gold
  '#ffffff',             // white
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20, // center-ish
    y: 50 + (Math.random() - 0.5) * 20,
    size: 4 + Math.random() * 10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    duration: 0.8 + Math.random() * 0.8,
    delay: Math.random() * 0.3,
    angle: Math.random() * 360,
    distance: 80 + Math.random() * 200,
    shape: (['circle', 'square', 'star'] as const)[Math.floor(Math.random() * 3)],
  }));
}

interface ParticleExplosionProps {
  active: boolean;
}

export default function ParticleExplosion({ active }: ParticleExplosionProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setParticles(generateParticles(55));
      setVisible(true);

      // Remove particles after animation
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setParticles([]), 300);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!visible || particles.length === 0) return null;

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => {
        const angleRad = (p.angle * Math.PI) / 180;
        const endX = Math.cos(angleRad) * p.distance;
        const endY = Math.sin(angleRad) * p.distance;

        return (
          <Box
            key={p.id}
            sx={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.shape === 'star' ? p.size * 1.5 : p.size,
              height: p.shape === 'star' ? p.size * 1.5 : p.size,
              borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : '50%',
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              animation: `particle-fly ${p.duration}s ease-out ${p.delay}s both`,
              '--particle-end': `translate(${endX}px, ${endY}px) scale(0)`,
              transform: 'translate(-50%, -50%)',
              // Star shape via clip-path
              clipPath: p.shape === 'star'
                ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                : 'none',
            } as React.CSSProperties & { '--particle-end': string }}
          />
        );
      })}
    </Box>
  );
}
