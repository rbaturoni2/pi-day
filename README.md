# Pi Day Birthday Finder

> *"Your birthday is hiding somewhere in π. Let's find it."*

A flashy, celebratory single-page web app that lets you enter your birthday, then performs a dramatic animated scan through **1,000,000 digits of Pi** to find where your birthday sequence appears.

Built for **Pi Day 2026** (March 14) by Roberto Baturoni — Oddiyana Consulting.

---

## Live Demo

Deploy instantly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rbaturoni2/pi-day)

---

## Features

- **Dramatic scanning animation** — digits stream across the screen like a hacker terminal, accelerating to a slam-stop when your birthday is found
- **Three search formats** — tries `MMDDYYYY` → `MMDDYY` → `MMDD`, returns the most specific match
- **Pi trivia ticker** — 25+ rotating facts about Pi play during the scan
- **Particle explosion** — confetti burst celebrates the match
- **Animated Pi digit rain** — Matrix-style background of falling Pi digits
- **Context window** — shows ~30 digits surrounding your match with the birthday highlighted
- **Copy to clipboard** — share your result instantly
- **Mobile-first** — works on iOS Safari, Chrome, and Firefox
- **Neon Cosmos theme** — dark cyberpunk aesthetic with cyan, hot pink, and gold accents

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| UI Library | MUI v5 (Material UI) |
| Animations | Framer Motion |
| Styling | MUI `sx` prop + Emotion + CSS keyframes |
| Pi Data | Static `.txt` — first 1,000,000 digits of Pi |
| Fonts | Orbitron (display) + DM Sans (body) via Google Fonts |
| Deployment | Vercel |

---

## Project Structure

```text
pi-birthday-finder/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider, fonts, metadata
│   ├── page.tsx            # Main (and only) page
│   └── globals.css         # Global styles and CSS animations
├── components/
│   ├── BirthdayInput.tsx   # Month/Day/Year dropdowns + Scan Pi button
│   ├── PiScanner.tsx       # The animated scanning visualization
│   ├── ResultCard.tsx      # Match result display with highlighted context
│   ├── PiBackground.tsx    # Animated falling Pi digit background
│   ├── ParticleExplosion.tsx # Confetti celebration on match found
│   ├── PiTrivia.tsx        # Rotating trivia facts during scan
│   └── ThemeRegistry.tsx   # MUI emotion cache for Next.js SSR
├── lib/
│   ├── piSearch.ts         # Core search logic
│   ├── piTrivia.ts         # 25+ Pi trivia facts + shuffle function
│   └── theme.ts            # MUI custom "Neon Cosmos" dark theme
└── public/
    └── pi-million.txt      # First 1,000,000 digits of Pi (after decimal)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/rbaturoni2/pi-day.git
cd pi-day/pi-birthday-finder
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## How It Works

### Search Logic

The app searches Pi's digits for your birthday in three formats (most specific first):

| Format | Example (July 4, 1990) |
| ------ | ---------------------- |
| `MMDDYYYY` | `07041990` |
| `MMDDYY` | `070490` |
| `MMDD` | `0704` |

It performs a simple `indexOf` search on the full 1M digit string and returns the **first match** of the **most specific format** found. The 4-digit `MMDD` format is virtually guaranteed to appear somewhere in 1 million digits.

### Animation Timing

The scan animation always takes 3.5–5 seconds regardless of the actual digit position (which is found instantly). The drama is entirely theatrical:

1. **Phase 1 (0–1s):** Slow scroll — individual digits visible
2. **Phase 2 (1–3s):** Accelerating — digits blur into a stream
3. **Phase 3 (3–3.5s):** Rapid deceleration
4. **Phase 4 (3.5s):** SLAM — freeze on the matched digits

### Pi Digit File

The file `public/pi-million.txt` contains exactly 1,000,000 decimal digits of Pi (no `3.` prefix — just the digits after the decimal point). It is loaded client-side on demand after the user clicks "Scan Pi" to keep the initial page load fast.

---

## Deployment to Vercel

```bash
npm install -g vercel
vercel
```

Or connect the GitHub repo to [vercel.com](https://vercel.com) for automatic deploys on every push. No environment variables required.

---

## Visual Theme — "Neon Cosmos"

| Token | Color | Usage |
| ----- | ----- | ----- |
| Background | `#06060e` | Page background |
| Surface | `#0d0d1a` | Cards |
| Primary | `#00e5ff` | Neon cyan — buttons, scanner, highlights |
| Secondary | `#ff2d7b` | Hot pink — match highlights, particles |
| Warning | `#ffd600` | Gold — celebration glow |
| Text | `#e8e8f0` | Main text |

---

## Credits

- Built with Claude Code CLI (one-shot generation from PRD)
- Pi digits sourced from public Pi digit datasets
- Created by Roberto Baturoni — [Oddiyana Consulting](https://oddiyana.com)

---

*Happy Pi Day! 3.14159265358979...*
