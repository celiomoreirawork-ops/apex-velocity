/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── APEX DASH v3 PALETTE ──────────────────────
        black:       "#000000",
        "gray-900":  "#24252E",
        "gray-600":  "#585B6C",
        "gray-400":  "#91939F",
        "gray-200":  "#D0D1D6",
        "blue-200":  "#94D1FF",
        "blue-400":  "#5B9FFF",
        "blue-700":  "#0523E5",
        "blue-800":  "#1A4195",
        "blue-900":  "#0C255C",

        // Legacy aliases (resolved to new tokens)
        background:     "#000000",
        "card-bg":      "#24252E",
        surface:        "#24252E",
        "on-surface":   "#FFFFFF",
        "on-background":"#FFFFFF",
        primary:        "#5B9FFF",   // blue-400
        "on-primary":   "#000000",
      },
      borderRadius: {
        DEFAULT: "10px",
        lg: "10px",
        xl: "10px",
        full: "9999px",
      },
      fontFamily: {
        sans:     ["Inter", "sans-serif"],
        headline: ["Inter", "sans-serif"],
        display:  ["Inter", "sans-serif"],
        body:     ["Inter", "sans-serif"],
        label:    ["Inter", "sans-serif"],
      },
      spacing: {
        "card-pad": "20px",
        "sidebar":  "200px",
      },
    },
  },
  plugins: [],
}
