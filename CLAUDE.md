# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Architecture

Ghostkeys is a Tauri v2 desktop application that simulates human-like typing. It has a React/TypeScript frontend and a Rust backend.

### Frontend (React + TypeScript)

- **Entry points**: Two separate entry points configured in `vite.config.ts`:
  - `index.html` / `src/main.tsx` → Main settings window (`src/App.tsx`)
  - `widget.html` / `src/widget-main.tsx` → Always-on-top progress widget (`src/Widget.tsx`)

- **State management**: Custom hooks in `src/hooks/`:
  - `useTypingState.ts` - Manages typing status, progress, file content; listens to Tauri events
  - `useConfig.ts` - Manages configuration sync with backend

- **Tauri IPC**: All backend calls go through `src/lib/commands.ts` using `@tauri-apps/api/core` invoke

- **Types**: Shared TypeScript types in `src/lib/types.ts` mirror Rust types in `src-tauri/src/config.rs`

### Backend (Rust + Tauri)

- **Entry point**: `src-tauri/src/main.rs` - Sets up Tauri plugins, tray menu, global shortcut (Ctrl+Alt+S)

- **Core library**: `src-tauri/src/lib.rs` - Exports Tauri commands and a global `TypingEngine` singleton

- **Typing engine**: `src-tauri/src/typer/mod.rs` - Main typing loop that:
  1. Runs countdown before typing
  2. Iterates through content character by character
  3. Calculates timing delays with human-like variance
  4. Optionally introduces and corrects mistakes
  5. Emits progress events to frontend

- **Subsystems** in `src-tauri/src/typer/`:
  - `timing.rs` - Calculates keystroke delays based on WPM, adds variance, handles warmup/fatigue simulation
  - `mistakes.rs` - Generates realistic typos (adjacent keys, transpositions, double-taps, omissions, wrong case)
  - `keyboard.rs` - Wraps `enigo` crate for actual keystroke injection

### Frontend-Backend Communication

Events emitted from Rust to frontend:
- `typing-progress` - Current character position and percentage
- `typing-state-changed` - Status transitions (idle/ready/countdown/typing/paused/done/error)
- `countdown-tick` - Countdown remaining seconds
- `typing-error` - Error messages

### Configuration

Config properties (defined in both `src/lib/types.ts` and `src-tauri/src/config.rs`):
- `baseWpm` - Target typing speed
- `wpmVariance` - Gaussian variance factor for timing
- `mistakeRate` - Probability of typos
- `correctionRate` - Probability of fixing mistakes
- `punctuationPause` / `paragraphPause` - Extra delays
- `thinkingPauseChance` / `thinkingPauseDuration` - Random pauses
- `burstTyping` - Occasionally type faster
- `countdownSeconds` - Delay before typing starts
