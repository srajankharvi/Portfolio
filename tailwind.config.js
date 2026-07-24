/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        section: "#0A0A0A",
        card: "#111111",
        "card-hover": "#181818",
        border: "#222222",
        "border-strong": "#2E2E2E",
        primary: "#FFFFFF",
        secondary: "#B3B3B3",
        muted: "#7A7A7A",
        accent: "#3B82F6",
        "accent-hover": "#2563EB",
        "accent-dim": "rgba(59, 130, 246, 0.12)",
      },
      fontFamily: {
        heading: ["Space Grotesk", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(59, 130, 246, 0.12)",
        "glow-sm": "0 0 15px rgba(59, 130, 246, 0.08)",
        "glow-lg": "0 0 50px rgba(59, 130, 246, 0.18)",
        card: "0 1px 3px rgba(0,0,0,0.5)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
