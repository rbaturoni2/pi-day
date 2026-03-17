'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(month: number, year: number): number {
  if (month === 0) return 31;
  return new Date(year, month, 0).getDate();
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

interface BirthdayInputProps {
  onScan: (date: Date) => void;
  isLoading?: boolean;
}

export default function BirthdayInput({ onScan, isLoading = false }: BirthdayInputProps) {
  const [month, setMonth] = useState<number | ''>('');
  const [day, setDay] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>('');

  const maxDays = month !== '' && year !== '' ? getDaysInMonth(Number(month), Number(year)) : 31;

  const isValid = month !== '' && day !== '' && year !== '' && Number(day) <= maxDays;

  const handleScan = useCallback(() => {
    if (!isValid) return;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    onScan(date);
  }, [isValid, month, day, year, onScan]);

  const selectSx = {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 229, 255, 0.2)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 229, 255, 0.5)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#00e5ff',
      boxShadow: '0 0 0 2px rgba(0, 229, 255, 0.15)',
    },
    '& .MuiSvgIcon-root': {
      color: '#00e5ff',
    },
    fontFamily: '"DM Sans", sans-serif',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          width: '100%',
          maxWidth: 520,
          mx: 'auto',
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Orbitron", monospace',
            color: '#e8e8f0',
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            textAlign: 'center',
            textShadow: '0 0 20px rgba(0, 229, 255, 0.3)',
          }}
        >
          Enter Your Birthday
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: '100%',
          }}
        >
          {/* Month */}
          <FormControl fullWidth>
            <InputLabel
              sx={{
                color: '#6b6b8a',
                '&.Mui-focused': { color: '#00e5ff' },
              }}
            >
              Month
            </InputLabel>
            <Select
              value={month}
              label="Month"
              onChange={(e) => {
                setMonth(e.target.value as number);
                setDay('');
              }}
              sx={selectSx}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#0d0d1a',
                    border: '1px solid rgba(0, 229, 255, 0.15)',
                    '& .MuiMenuItem-root': {
                      '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.08)' },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(0, 229, 255, 0.12)',
                        '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.18)' },
                      },
                    },
                  },
                },
              }}
            >
              {MONTHS.map((name, idx) => (
                <MenuItem key={idx + 1} value={idx + 1}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Day */}
          <FormControl fullWidth>
            <InputLabel
              sx={{
                color: '#6b6b8a',
                '&.Mui-focused': { color: '#00e5ff' },
              }}
            >
              Day
            </InputLabel>
            <Select
              value={day}
              label="Day"
              onChange={(e) => setDay(e.target.value as number)}
              sx={selectSx}
              disabled={month === ''}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#0d0d1a',
                    border: '1px solid rgba(0, 229, 255, 0.15)',
                    maxHeight: 300,
                    '& .MuiMenuItem-root': {
                      '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.08)' },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(0, 229, 255, 0.12)',
                        '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.18)' },
                      },
                    },
                  },
                },
              }}
            >
              {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Year */}
          <FormControl fullWidth>
            <InputLabel
              sx={{
                color: '#6b6b8a',
                '&.Mui-focused': { color: '#00e5ff' },
              }}
            >
              Year
            </InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value as number)}
              sx={selectSx}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#0d0d1a',
                    border: '1px solid rgba(0, 229, 255, 0.15)',
                    maxHeight: 300,
                    '& .MuiMenuItem-root': {
                      '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.08)' },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(0, 229, 255, 0.12)',
                        '&:hover': { bgcolor: 'rgba(0, 229, 255, 0.18)' },
                      },
                    },
                  },
                },
              }}
            >
              {YEARS.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          size="large"
          disabled={!isValid || isLoading}
          onClick={handleScan}
          sx={{
            width: '100%',
            py: 2,
            fontSize: '1.1rem',
            fontFamily: '"Orbitron", monospace',
            fontWeight: 700,
            letterSpacing: '0.08em',
            background: isValid
              ? 'linear-gradient(135deg, #00e5ff 0%, #0097a7 100%)'
              : 'rgba(0, 229, 255, 0.15)',
            color: isValid ? '#06060e' : '#6b6b8a',
            borderRadius: 3,
            animation: isValid ? 'button-pulse 2s ease-in-out infinite' : 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: isValid
                ? 'linear-gradient(135deg, #6effff 0%, #00e5ff 100%)'
                : 'rgba(0, 229, 255, 0.15)',
              transform: isValid ? 'translateY(-2px)' : 'none',
              boxShadow: isValid ? '0 8px 32px rgba(0, 229, 255, 0.4)' : 'none',
            },
            '&:active': {
              transform: 'translateY(0px)',
            },
            '&.Mui-disabled': {
              background: 'rgba(0, 229, 255, 0.08)',
              color: '#6b6b8a',
            },
          }}
        >
          {isLoading ? 'Loading Pi...' : 'Scan Pi →'}
        </Button>

        <Typography
          variant="body2"
          sx={{
            color: '#6b6b8a',
            textAlign: 'center',
            fontSize: '0.8rem',
            mt: -2,
          }}
        >
          We&apos;ll search through 1,000,000 digits of π to find your birthday
        </Typography>
      </Box>
    </motion.div>
  );
}
