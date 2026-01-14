/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./widget.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark pastel color scheme
        ghost: {
          50: "#f7f7f8",
          100: "#e8e8eb",
          200: "#d4d4d9",
          300: "#a8a8b3",
          400: "#71717a",
          500: "#52525b",
          600: "#3f3f46",
          700: "#2e2e33",
          800: "#1f1f23",
          900: "#141416",
          950: "#0a0a0b",
        },
        // Accent colors (muted, pastel-like)
        accent: {
          primary: "#8b9a82",    // Sage green
          secondary: "#a39382",  // Warm taupe
          success: "#7d9a82",    // Muted green
          warning: "#c4a574",    // Muted gold
          error: "#b07878",      // Dusty rose
          info: "#7889a0",       // Steel blue
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', '"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
