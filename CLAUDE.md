# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ghostkeys** is a Tauri v2 desktop application that simulates human-like typing. It types text from files with realistic timing, mistakes, and corrections to appear as natural human input.

**Repository:** https://github.com/ultratrikx/ghostkeys

## Build Commands

```bash
# Development (runs Vite dev server)
npm run dev

# Build frontend only
npm run build

# Run Tauri in development mode (frontend + Rust backend)
npm run tauri dev

# Build production release
npm run tauri build
```

Production builds output to:
- `src-tauri/target/release/ghostkeys.exe` - Executable
- `src-tauri/target/release/bundle/msi/` - MSI installer
- `src-tauri/target/release/bundle/nsis/` - NSIS installer

## Architecture

### Frontend (React + TypeScript)

- **Entry points**: Two separate entry points configured in `vite.config.ts`:
  - `index.html` / `src/main.tsx` → Main settings window (`src/App.tsx`)
  - `widget.html` / `src/widget-main.tsx` → Always-on-top progress widget (`src/Widget.tsx`)

- **State management**: Custom hooks in `src/hooks/`:
  - `useTypingState.ts` - Manages typing status, progress, file content; listens to Tauri events
  - `useConfig.ts` - Manages configuration sync with backend

- **Tauri IPC**: All backend calls go through `src/lib/commands.ts` using `@tauri-apps/api/core` invoke

- **Types**: Shared TypeScript types in `src/lib/types.ts` mirror Rust types in `src-tauri/src/config.rs`

- **Components**:
  - `SettingsPanel.tsx` - Collapsible accordion sections with hover tooltips for each setting
  - `FileDropzone.tsx` - Drag & drop file loader
  - `TypingControls.tsx` - Start/Stop/Pause/Resume buttons
  - `StatusBar.tsx` - Progress display with ETA
  - `CountdownOverlay.tsx` - Fullscreen countdown before typing starts
  - `widget/` - Miniature always-on-top progress widget components

### Backend (Rust + Tauri)

- **Entry point**: `src-tauri/src/main.rs` - Sets up Tauri plugins, tray menu, global shortcut (Ctrl+Alt+S)

- **Core library**: `src-tauri/src/lib.rs` - Exports Tauri commands and a global `TypingEngine` singleton

- **Typing engine**: `src-tauri/src/typer/mod.rs` - Main typing loop that:
  1. Runs countdown before typing
  2. Iterates through content character by character
  3. Uses `calculate_delay_v2()` for word-aware timing
  4. Optionally introduces and corrects mistakes
  5. Emits progress events to frontend

- **Subsystems** in `src-tauri/src/typer/`:
  - `timing.rs` - Enhanced human-like timing with word rhythm, digraph recognition, hand alternation
  - `mistakes.rs` - Generates realistic typos (adjacent keys, transpositions, double-taps, omissions, wrong case)
  - `keyboard.rs` - Wraps `enigo` crate for actual keystroke injection

### Human-Like Timing System (`timing.rs`)

The typing simulation uses `calculate_delay_v2()` which implements:

**Word-Level Rhythm:**
- Slight hesitation at word starts (15-30% slower)
- Momentum builds mid-word (faster in the middle)
- Slower at word boundaries and spaces

**Muscle Memory Patterns:**
- Common digraphs typed 15-25% faster: `th`, `er`, `in`, `an`, `re`, `on`, `he`, etc.
- Hand alternation bonus - letters typed with alternating hands are faster
- Same-hand sequences slightly slower

**Natural Pauses:**
- Thinking pauses more likely at word boundaries, rarely mid-word
- Sentence-ending punctuation (. ! ?) gets longer pauses
- Mid-sentence punctuation (, ; :) gets shorter pauses

**Flow Patterns:**
- Warmup period for first 30 characters
- Fatigue simulation near the end (after 85%)
- Occasional burst typing (flow state)

### Frontend-Backend Communication

Events emitted from Rust to frontend:
- `typing-progress` - Current character position and percentage
- `typing-state-changed` - Status transitions (idle/ready/countdown/typing/paused/done/error)
- `countdown-tick` - Countdown remaining seconds
- `typing-error` - Error messages

### Configuration

Config properties (defined in both `src/lib/types.ts` and `src-tauri/src/config.rs`):
- `baseWpm` - Target typing speed (words per minute)
- `wpmVariance` - Gaussian variance factor for timing randomization
- `mistakeRate` - Probability of making typos (0-15%)
- `correctionRate` - Probability of fixing mistakes with backspace
- `punctuationPause` - Extra delay after punctuation (ms)
- `paragraphPause` - Extra delay at newlines (ms)
- `thinkingPauseChance` - Probability of random thinking pauses
- `thinkingPauseDuration` - How long thinking pauses last (ms)
- `burstTyping` - Enable occasional faster typing bursts
- `countdownSeconds` - Delay before typing starts

## UI Design System

### Color Palette

Dark pastel theme defined in `tailwind.config.js`:

**Ghost (neutrals):**
- `ghost-950`: `#0a0a0b` (darkest background)
- `ghost-900`: `#141416`
- `ghost-800`: `#1f1f23`
- `ghost-700`: `#2e2e33`
- `ghost-500`: `#52525b`
- `ghost-300`: `#a8a8b3`
- `ghost-100`: `#e8e8eb`

**Accent colors (muted pastels):**
- `accent-primary`: `#8b9a82` (Sage green) - Primary actions, progress bars
- `accent-success`: `#7d9a82` (Muted green) - Success states
- `accent-warning`: `#c4a574` (Muted gold) - Warnings, paused state
- `accent-error`: `#b07878` (Dusty rose) - Errors, stop button
- `accent-info`: `#7889a0` (Steel blue) - Info states

### Typography

- **Primary font**: Source Serif 4 (serif) - Loaded from Google Fonts
- **Monospace**: JetBrains Mono - For values, percentages, code

### UI Components

- **Settings Panel**: Collapsible accordion sections with expand/collapse animation
- **Tooltips**: Hover over setting labels (dotted underline) to see descriptions
- **Range Sliders**: Custom styled with sage green thumb
- **Buttons**: Muted colors with subtle hover states

## Known Issues & Fixes

### Production Build Crashes

If the production build crashes immediately:

1. **Double plugin registration** - The global shortcut plugin must only be registered once in `main.rs`
2. **Invalid plugin config** - The `plugins` section in `tauri.conf.json` should be empty `{}`, not contain empty objects like `"global-shortcut": {}`

### Global Shortcut

The app registers `Ctrl+Alt+S` as a global hotkey to start/stop typing. The handler is set up during plugin initialization, with the app handle stored via `Arc<Mutex<Option<AppHandle>>>` and populated during setup.

## File Structure

```
ghostkeys/
├── src/                      # React frontend
│   ├── components/           # UI components
│   │   ├── widget/          # Widget-specific components
│   │   ├── SettingsPanel.tsx
│   │   ├── FileDropzone.tsx
│   │   └── ...
│   ├── hooks/               # React hooks
│   ├── lib/                 # Commands, types
│   ├── styles/globals.css   # Global styles, font imports
│   ├── App.tsx              # Main window
│   └── Widget.tsx           # Progress widget
├── src-tauri/               # Rust backend
│   ├── src/
│   │   ├── typer/          # Typing simulation
│   │   │   ├── mod.rs      # TypingEngine
│   │   │   ├── timing.rs   # Delay calculation
│   │   │   ├── mistakes.rs # Typo generation
│   │   │   └── keyboard.rs # Keystroke injection
│   │   ├── config.rs       # Config types
│   │   ├── lib.rs          # Exports, helpers
│   │   └── main.rs         # Entry point
│   └── tauri.conf.json     # Tauri config
├── tailwind.config.js       # Theme colors, fonts
└── package.json
```
