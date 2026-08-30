/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        "bg-alt": "#050505",
        section: "#030305",
        card: "#0A0A0E",
        "card-hover": "#121219",
        border: "rgba(255, 255, 255, 0.06)",
        "border-strong": "rgba(255, 255, 255, 0.1)",
        "border-hover": "rgba(255, 255, 255, 0.14)",
        primary: "#FFFFFF",
        secondary: "#B3B3B3",
        muted: "#7A7A7A",
        accent: "#3B82F6",
        "accent-hover": "#2563EB",
        "accent-bright": "#60A5FA",
        "accent-dim": "rgba(59, 130, 246, 0.12)",
        "accent-glow": "rgba(59, 130, 246, 0.25)",
      },
      fontFamily: {
        heading: ["Space Grotesk", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(59, 130, 246, 0.10)",
        "glow-sm": "0 0 15px rgba(59, 130, 246, 0.06)",
        "glow-lg": "0 0 50px rgba(59, 130, 246, 0.15)",
        card: "0 1px 3px rgba(0,0,0,0.8)",
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
