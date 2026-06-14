/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#27324a",
        cloud: "#f9fcff",
        skyPastel: "#bfe7ff",
        skyBright: "#63b8ff",
        peachPastel: "#ffd7bd",
        mintPastel: "#c8f6dd",
        lemonPastel: "#fff2a8",
        lilacPastel: "#dfd4ff",
      },
      boxShadow: {
        sticker: "0 18px 0 rgba(39, 50, 74, 0.05), 0 24px 54px rgba(87, 113, 155, 0.16)",
        soft: "0 18px 45px rgba(87, 113, 155, 0.14)",
        glow: "0 0 0 6px rgba(99, 184, 255, 0.16), 0 18px 38px rgba(99, 184, 255, 0.22)",
      },
      borderRadius: {
        cartoon: "2rem",
      },
      fontFamily: {
        heading: ['"Baloo 2"', "ui-rounded", "system-ui", "sans-serif"],
        sans: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
