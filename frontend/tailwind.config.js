/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* --- MAIN BACKGROUND SHADES (GREY THEME) --- */
        panel: "#1a1a1c",         // Card background
        panelLight: "#232325",    // Slightly lighter card
        panelLighter: "#2d2d2f",  // For inner sections

        /* --- PRIMARY ACCENT COLOR (BLUE) --- */
        accent: {
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",   // Confirm button + highlights
        },

        /* Status colors */
        success: "#4ade80",
        danger: "#ef4444",
        warning: "#fb923c",
      },

      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.35)",
        glow: "0 0 30px rgba(59,130,246,0.35)", // blue glow
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },

      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
