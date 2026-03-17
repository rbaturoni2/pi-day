# Product Requirements Document
## 🥧 **Pi Day Birthday Finder**
### *"Find Your Birthday in Pi"*

**Version:** 1.1
**Date:** March 14, 2026 (Pi Day 🎉)
**Author:** Roberto Baturoni — Oddiyana Consulting
**Stack:** Next.js 14 (App Router) + Material UI (MUI) v5 + Vercel Deployment
**Build Method:** Claude Code CLI — one-shot generation

---

## 1. Product Overview

### 1.1 Concept
A flashy, celebratory single-page web application that lets users enter their birthday, then performs a dramatic animated "scan" through the digits of Pi (π) to locate where their birthday sequence appears. The experience should feel like a slot machine / hacker terminal / particle accelerator moment — maximum visual spectacle.

### 1.2 Tagline
*"Your birthday is hiding somewhere in π. Let's find it."*

### 1.3 Target Audience
- Math enthusiasts, Pi Day celebrants, social media sharers
- Anyone who enjoys a fun, flashy interactive micro-experience
- Ages 10+, mobile-first but desktop-gorgeous

### 1.4 Success Metrics
- Shareable results (screenshot-worthy output)
- Sub-3-second load time on Vercel
- Works on mobile Safari, Chrome, Firefox

---

## 2. Technical Architecture

### 2.1 Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, `app/` directory) |
| UI Library | MUI v5 (`@mui/material`, `@mui/icons-material`) |
| Styling | MUI `sx` prop + Emotion (comes with MUI) + CSS keyframe animations |
| Animation | Framer Motion (`framer-motion`) for orchestrated sequences |
| Pi Data | Static file — first 1,000,000 digits of Pi (bundled as a `.txt` in `public/`) |
| Deployment | Vercel (zero-config Next.js) |
| Font | Google Fonts — use two: a display font (e.g., "Orbitron", "Space Mono", or "Bungee Shade") for headings/pi-digits + a clean body font (e.g., "DM Sans", "Outfit", or "Sora") |

### 2.2 Project Structure
```
pi-birthday-finder/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider, fonts, metadata
│   ├── page.tsx            # Main (and only) page
│   ├── globals.css         # Global styles, CSS animations, backgrounds
│   └── favicon.ico
├── components/
│   ├── BirthdayInput.tsx   # Date picker / input component
│   ├── PiScanner.tsx       # The animated scanning visualization
│   ├── ResultCard.tsx      # The final result display
│   ├── PiBackground.tsx    # Animated background of scrolling Pi digits
│   ├── ParticleExplosion.tsx # Celebration effect on match found
│   └── PiTrivia.tsx        # Rotating trivia facts shown during scan
├── lib/
│   ├── piSearch.ts         # Core search logic
│   ├── piTrivia.ts         # Pi trivia facts data + random selector
│   └── theme.ts            # MUI custom theme definition
├── public/
│   └── pi-million.txt      # First 1,000,000 digits of Pi (after decimal)
├── package.json
├── tsconfig.json
├── next.config.js
└── vercel.json             # (if needed)
```

### 2.3 Pi Data Source
- Bundle a static text file containing the first 1,000,000 digits of Pi (digits only, no "3." prefix — just the decimal digits).
- Source: publicly available Pi digit datasets (e.g., from piday.org or similar).
- Load via `fetch('/pi-million.txt')` on the client side, or read at build time with `fs` and pass as a prop for SSR.
- Preferred approach: load client-side on demand (after user enters birthday) to keep initial bundle small.

---

## 3. User Experience Flow

### 3.1 Flow Diagram

```
[Landing Screen] → [Enter Birthday] → [Scanning Animation] → [Result Reveal] → [Share/Retry]
```

### 3.2 Detailed Screens

#### Screen 1: Landing / Hero
- **Background:** Dark theme (near-black, e.g., `#0a0a0f`) with a subtle animated rain of Pi digits falling in the background (matrix-style but with π digits, in a muted color like `rgba(100, 200, 255, 0.08)`)
- **Hero content (centered):**
  - Large animated "π" symbol — pulsing glow effect (neon cyan/electric blue, or gold)
  - Title: **"Find Your Birthday in Pi"** — large display font, glowing text-shadow
  - Subtitle: *"March 14 — Happy Pi Day! Your birthday is hidden somewhere in the infinite digits of π. Let's find it."*
  - A glowing **"Enter Your Birthday"** button or the date input itself

#### Screen 2: Birthday Input
- **MUI DatePicker** or a custom stylized input (three dropdowns: Month / Day / Year, or a single date field)
- The birthday should be converted to the following search formats (search ALL, show the first match found):
  - `MMDDYYYY` (e.g., July 4, 1990 → `07041990`)
  - `MMDDYY` (e.g., → `070490`)
  - `MMDD` (e.g., → `0704`)
- Display which format was found (e.g., "Your full birthday MMDDYYYY was found!" vs "Your month + day MMDD was found!")
- **CTA Button:** "Scan Pi" — large, glowing, with a hover pulse animation

#### Screen 3: Pi Scanning Animation (THE STAR OF THE SHOW)
This is the most important screen. It should feel like a high-tech search through infinite data.

**Visual concept — "Digital Helix Scanner":**
1. **Transition in:** Screen darkens, a horizontal beam of light sweeps across
2. **Pi digit stream:** A monospaced scrolling display of Pi's digits, racing across the screen left-to-right (or top-to-bottom), like a stock ticker on steroids
   - Digits should be in the display font, glowing slightly
   - Color: mostly muted (dim white/gray), with the "current scan position" highlighted in bright neon (cyan, electric blue, or hot pink)
3. **Scanner element:** A vertical glowing line (like a barcode scanner) that sweeps through the digits, leaving a trail/afterglow
4. **Progress indicator:** Show current position in Pi being scanned (e.g., "Scanning digit 142,857...") — numbers should tick up rapidly
5. **Speed ramping:** Start slow enough to see individual digits (~500ms), then ACCELERATE dramatically (like a slot machine speeding up), then SLAM to a stop when found
6. **Duration:** The entire scan animation should last 3–5 seconds regardless of actual position (fake the pacing for drama)
7. **Near-miss moments (optional flourish):** Briefly flash/highlight partial matches as it scans (e.g., "07" lights up briefly before continuing to search for "0704")
8. **Pi Trivia ticker:** While the scan runs, display rotating Pi trivia facts beneath the digit stream (see Section 6.6 for full spec). Facts cycle every ~1.5s with a crossfade animation, giving users something delightful to read during the theatrical scan. Example facts:
   - "π has been calculated to over 105 trillion digits"
   - "There is no 0 in the first 31 digits of π"
   - "π Day was first celebrated in 1988 at the San Francisco Exploratorium"
   - "In the Star Trek episode 'Wolf in the Fold,' Spock commands a computer to compute π to its last digit"

**Audio (optional, low priority):** A subtle rising-pitch electronic hum that crescendos at the reveal. Implement with Web Audio API if time permits. Not required for v1.

#### Screen 4: Result Reveal (THE PAYOFF)
When the birthday is found:

1. **Slam stop:** The scrolling digits freeze. A beat of silence/stillness (200ms).
2. **Highlight explosion:** The matched digits illuminate brightly (scale up slightly, glow intensifies, color shifts to gold or hot pink)
3. **Particle burst:** Confetti / particle explosion emanates from the matched digits — use CSS particles or a lightweight library
4. **Context display:** Show a window of ~30 digits around the match, with the birthday digits highlighted in a contrasting accent color:
   ```
   ...14159265358979323846264338327950288419716939937510...
                                          ^^^^
                                          0704
   ```
5. **Result card (MUI Card, elevated):**
   - "🎉 Your birthday was found!"
   - **"[MMDD / MMDDYY / MMDDYYYY] appears at position [N] in Pi"**
   - The matched digit window with highlighting
   - A fun fact: "That means your birthday is hiding [N] digits deep in the infinite decimal expansion of π"
6. **Share section:**
   - "Try Another Birthday" button
   - Copy-to-clipboard button for the result text
   - (Stretch) Generate a shareable image/card

#### Screen 5: Not Found (Edge case — very unlikely with MMDD in 1M digits)
- "Your full birthday wasn't found in the first 1,000,000 digits of Pi... but you're clearly one in a million 😏"
- Offer to search with fewer digits (MMDD)
- Still make it feel celebratory, not like a failure

---

## 4. Visual Design Specification

### 4.1 Theme: "Neon Cosmos"
A dark, futuristic aesthetic with neon accents — think cyberpunk meets planetarium.

| Token | Value | Usage |
|-------|-------|-------|
| `background.default` | `#06060e` | Page background |
| `background.paper` | `#0d0d1a` | Card/surface backgrounds |
| `primary.main` | `#00e5ff` | Primary neon cyan — buttons, highlights, scanner |
| `primary.light` | `#6effff` | Hover states, glows |
| `secondary.main` | `#ff2d7b` | Hot pink accent — match highlights, particles |
| `secondary.light` | `#ff6faa` | Secondary hover |
| `warning.main` | `#ffd600` | Gold — celebration, found-match glow |
| `text.primary` | `#e8e8f0` | Main text |
| `text.secondary` | `#6b6b8a` | Subdued text, non-highlighted Pi digits |

### 4.2 Typography
- **Display / Pi Digits:** "Orbitron" or "Space Mono" (monospace for digits) — Google Fonts
- **Body:** "DM Sans" or "Outfit" — Google Fonts
- Pi digit display should be monospaced for alignment

### 4.3 Key Visual Effects (CSS/Framer Motion)
1. **Glow text-shadow:** `0 0 10px rgba(0, 229, 255, 0.5), 0 0 40px rgba(0, 229, 255, 0.15)`
2. **Pulsing animation:** Subtle scale(1.02) + opacity oscillation on the π symbol
3. **Digit rain background:** CSS animation with staggered columns of falling digits (like The Matrix but with 0–9)
4. **Scanner sweep:** A `linear-gradient` pseudo-element that translates across the digit display
5. **Particle explosion:** 30–50 small circles/squares with random trajectories, fading out over 1.5s
6. **Frosted glass cards:** `backdrop-filter: blur(12px)` with subtle border glow

### 4.4 Responsive Breakpoints
- Mobile-first: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- The digit scanner should be full-width on mobile, centered with max-width on desktop

---

## 5. Core Logic Specification

### 5.1 `piSearch.ts`

```typescript
interface PiSearchResult {
  found: boolean;
  position: number;      // 1-indexed position in Pi's decimal expansion
  matchedFormat: 'MMDDYYYY' | 'MMDDYY' | 'MMDD';
  searchString: string;  // The actual string that was searched
  context: string;       // ~30 digits surrounding the match
  contextStart: number;  // Position where context window begins
  matchIndexInContext: number; // Index within context string where match starts
}

function searchPi(piDigits: string, birthday: Date): PiSearchResult | null {
  // 1. Generate search strings in priority order:
  //    - MMDDYYYY (most specific, best result)
  //    - MMDDYY
  //    - MMDD (most likely to be found)
  // 2. For each format, do a simple string indexOf search
  // 3. Return the MOST SPECIFIC match found (prefer MMDDYYYY over MMDD)
  // 4. Include 15 digits before and after the match as context
  // 5. Position is 1-indexed (first digit after decimal = position 1)
}
```

### 5.2 Animation Timing Logic
The scan animation should NOT reflect actual search time (which is instant). Instead:

```typescript
function calculateAnimationTiming(actualPosition: number): AnimationConfig {
  // Total animation duration: 3.5–5 seconds
  // Phase 1 (0–1s): Slow scroll, ~10 digits/sec visible
  // Phase 2 (1–3s): Accelerating scroll, digits blur
  // Phase 3 (3–3.5s): Rapid deceleration (easing: cubic-bezier)
  // Phase 4 (3.5s): SLAM — freeze on the matched position
  //
  // The displayed "current position" counter should interpolate
  // from 0 to actualPosition with easing, NOT linearly
  // Use requestAnimationFrame for smooth counter animation
}
```

### 5.3 Date Formatting

```typescript
function formatBirthdaySearchStrings(date: Date): string[] {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  const yy = yyyy.slice(-2);

  return [
    `${mm}${dd}${yyyy}`,  // MMDDYYYY — try first
    `${mm}${dd}${yy}`,    // MMDDYY
    `${mm}${dd}`,          // MMDD
  ];
}
```

---

## 6. Component Specifications

### 6.1 `BirthdayInput.tsx`
- Uses MUI `TextField` with type `date` OR three `Select` dropdowns (Month, Day, Year)
- Recommendation: Use three styled `Select` dropdowns for maximum visual control
- Month range: 1–12, Day range: 1–31 (validate per month), Year range: 1900–2026
- Glowing border on focus
- "Scan Pi" button — large, rounded, with neon glow + pulse-on-hover
- Disable button until valid date is entered

### 6.2 `PiScanner.tsx`
- Receives: `piDigits: string`, `targetPosition: number`, `searchString: string`
- Manages the entire scanning animation lifecycle
- Uses `requestAnimationFrame` for smooth digit scrolling
- Renders a horizontal band of ~40 visible digits at any time
- The "scanner line" is a glowing vertical bar that sweeps left-to-right
- Emits `onComplete` callback when animation finishes

### 6.3 `ResultCard.tsx`
- Receives: `PiSearchResult`
- MUI `Card` with `elevation={8}`, frosted glass effect
- Animated entrance (Framer Motion: fade-up + scale)
- Displays: match format, position, context with highlighting
- "Try Again" and "Copy Result" buttons

### 6.4 `PiBackground.tsx`
- Renders animated falling/scrolling Pi digits as background atmosphere
- Should be performant (use CSS animations, NOT JavaScript-driven per-digit)
- Render ~15–20 columns of digits, each scrolling at slightly different speeds
- Very low opacity (`0.04–0.08`) to not distract from foreground
- Use `will-change: transform` and `transform: translateY()` for GPU acceleration

### 6.5 `ParticleExplosion.tsx`
- Triggered on match found
- 40–60 particles with random: angle, velocity, size, color (mix of primary + secondary + gold)
- CSS animations with randomized `animation-duration` and `animation-delay`
- Particles fade out and are removed from DOM after animation completes
- Alternative: use a lightweight confetti library like `canvas-confetti` (a single 7kb dependency)

### 6.6 `PiTrivia.tsx`
- **Purpose:** Display rotating Pi trivia facts during the scanning animation to entertain users and add educational value
- **Props:** `isActive: boolean` (controls start/stop of rotation), `intervalMs?: number` (default 1500)
- **Behavior:**
  - When `isActive` becomes true, begin cycling through trivia facts from `lib/piTrivia.ts`
  - Each fact crossfades in (Framer Motion: `AnimatePresence` with fade + slight translateY)
  - Cycle interval: 1.5 seconds per fact
  - Randomize order on each session (Fisher-Yates shuffle)
  - When `isActive` becomes false (scan complete), the current fact fades out gracefully
- **Visual style:**
  - Positioned below the digit scanner stream
  - Text in the body font (DM Sans), italic, `text.secondary` color
  - Prefixed with a small "π" icon or emoji in `primary.main` cyan
  - Frosted glass pill/chip background: `rgba(13, 13, 26, 0.7)` with `backdrop-filter: blur(8px)`
  - Max-width 500px, centered, with padding
- **Layout on mobile:** Full-width with smaller font size, still below the scanner

### 6.7 `lib/piTrivia.ts`
A static array of 25+ Pi trivia facts. The component picks randomly without repeating until all are shown. Include a mix of categories:

**Mathematical facts:**
- "π is irrational — its decimal expansion never terminates or repeats"
- "π is also transcendental — it's not the root of any polynomial with rational coefficients"
- "The first 144 digits of π add up to 666"
- "There is no 0 in the first 31 digits of π"
- "At position 762, there are six 9s in a row — known as the Feynman Point"
- "π to 39 decimal places is enough to calculate the circumference of the observable universe to within the width of a hydrogen atom"
- "The fraction 355/113 approximates π to six decimal places"
- "π has been calculated to over 105 trillion digits (as of 2024)"

**Historical facts:**
- "The symbol π was first used by Welsh mathematician William Jones in 1706"
- "Archimedes approximated π around 250 BC using 96-sided polygons"
- "Ancient Egyptians estimated π as 3.1605 — pretty close for 1650 BC"
- "Leonhard Euler popularized the π symbol starting in 1737"
- "In 1897, Indiana almost legislated π to be 3.2 — the bill failed in the state Senate"
- "π Day (March 14) was first celebrated in 1988 at the San Francisco Exploratorium"
- "March 14 is also Albert Einstein's birthday"

**Cultural & fun facts:**
- "In the Star Trek episode 'Wolf in the Fold,' Spock defeats an evil entity by commanding a computer to compute π to its last digit"
- "There's an entire literary genre called Pilish where word lengths follow the digits of π"
- "The world record for memorizing π is 70,030 digits, held by Suresh Kumar Sharma"
- "If you search hard enough, your phone number is probably somewhere in π"
- "The 'Pi search' concept works because π is believed to be a normal number — every finite sequence of digits should appear somewhere"
- "In 2015, Google calculated π to 31.4 trillion digits — a cheeky nod to 3.14"
- "Kate Bush released a song called 'π' in 2005 that includes her singing 150+ digits"
- "The probability of your 4-digit birthday NOT appearing in 1 million digits of π is essentially zero"

```typescript
// lib/piTrivia.ts
export interface PiTrivia {
  fact: string;
  category: 'math' | 'history' | 'culture';
}

export const PI_TRIVIA: PiTrivia[] = [
  { fact: "π is irrational — its decimal expansion never terminates or repeats", category: "math" },
  // ... all facts above
];

export function getShuffledTrivia(): PiTrivia[] {
  const shuffled = [...PI_TRIVIA];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

---

## 7. MUI Theme Configuration

```typescript
// lib/theme.ts
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
    // ... etc
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
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
  },
});
```

---

## 8. Performance Requirements

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 90 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Pi data load | Lazy, on user action |
| Animation framerate | 60fps (use CSS/GPU-accelerated transforms) |
| Bundle size | < 300kb gzipped (excluding Pi data) |

### Optimization Notes
- Pi digit file (~1MB raw) should be fetched only after user clicks "Scan Pi"
- Consider compressing pi data or loading in chunks
- All animations should use `transform` and `opacity` only (GPU-composited)
- Avoid `framer-motion` `layout` animations on the digit stream (perf risk) — use CSS for the heavy lifting, Framer for orchestrated reveals

---

## 9. Deployment

### 9.1 Vercel Configuration
- Zero-config: `vercel deploy` or connect GitHub repo
- Environment: Node.js 18+
- No environment variables needed for v1
- Static file serving via `public/` directory

### 9.2 Build Commands
```bash
npx create-next-app@latest pi-birthday-finder --typescript --tailwind --app --src-dir=false
cd pi-birthday-finder
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material framer-motion
# Optional: npm install canvas-confetti
```

### 9.3 Metadata / SEO
```typescript
// app/layout.tsx metadata
export const metadata = {
  title: 'Find Your Birthday in Pi | Pi Day 2026',
  description: 'Enter your birthday and watch as we scan through a million digits of Pi to find where your birthday is hiding. Happy Pi Day!',
  openGraph: {
    title: 'Find Your Birthday in Pi 🥧',
    description: 'Your birthday is hidden somewhere in π. Find it!',
    type: 'website',
  },
};
```

---

## 10. Stretch Goals (v1.1)

These are NOT required for the initial one-shot build but would be great additions:

1. **Shareable image generation** — Use `html2canvas` or server-side rendering to generate a result card image for social sharing
2. **Sound design** — Subtle scanning hum + celebration chime using Web Audio API
3. **Leaderboard** — "Earliest position found" across all visitors (would need a simple API/DB)
4. **Name search** — Convert a name to its numeric equivalent (A=01, B=02...) and search Pi
5. **Dark/light toggle** — Though the dark neon theme IS the product
6. **Pi recitation challenge** — A mini-game to type Pi digits from memory

---

## 11. Claude Code CLI Instructions

### One-Shot Prompt Guidance
When feeding this PRD to Claude Code, use a prompt like:

```
Build this entire app from this PRD. Create all files, install all dependencies,
and make it ready to deploy to Vercel. Use Next.js 14 App Router with TypeScript,
MUI v5, and Framer Motion. The Pi digit file should contain at least 1,000,000 digits.
Make the scanning animation as flashy and dramatic as possible — this is a celebration app.
Follow the PRD exactly for component structure, theming, and animation specs.
```

### Key Reminders for Claude Code
- Do NOT use Tailwind for styling (use MUI `sx` prop and Emotion) — the `--tailwind` flag in create-next-app can be omitted or Tailwind can be removed after scaffolding
- The Pi digit file needs to actually contain 1M digits — generate or download it
- All animations should target 60fps
- Test that the date picker works correctly across browsers
- The app is a SINGLE PAGE — no routing needed beyond `app/page.tsx`

---

*Built with 🥧 on Pi Day 2026 — Roberto Baturoni / Oddiyana Consulting*
