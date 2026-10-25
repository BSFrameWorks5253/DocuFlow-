/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Plus Jakarta Sans"',
          "system-ui",
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', '"SF Mono"', "monospace"],
      },
      colors: {
        anything: {
          surface: "rgba(255, 255, 255, 0.04)",
          surfaceHover: "rgba(255, 255, 255, 0.08)",
          glassBorder: "rgba(255, 255, 255, 0.12)",
          glassBorderHover: "rgba(255, 255, 255, 0.25)",
        },
        converter: {
          blue: '#0284c7',
          cyan: '#06b6d4',
          bg: '#090b10',
          card: '#12151e',
          border: '#232838',
          accent: '#38bdf8'
        }
      },
      boxShadow: {
        "liquid-card": "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -1px 1px rgba(0, 0, 0, 0.3)",
        "liquid-glow": "0 0 35px -5px rgba(56, 189, 248, 0.25)",
        "adobe-tile": "0 8px 24px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      }
    }
  },
  plugins: []
};
