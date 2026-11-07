/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        ink: "#0f0917",
        coal: "#140c1e",
        panel: "#1b1028",
        "panel-soft": "#251534",
        lime: "#8aff3c",
        "lime-deep": "#6fe024",
        violet: "#c084fc",
        "violet-deep": "#7c3aed",
        cream: "#f7f2ff",
        "cream-deep": "#e9dff5",
        smoke: "#b6a5c9",
        coral: "#ff6b8a",
        amber: "#ffd166",
      },
      fontFamily: {
        sans: ["Manrope Variable", "Manrope", "Segoe UI", "sans-serif"],
        display: ["Barlow Condensed", "Arial Narrow", "sans-serif"],
      },
      boxShadow: {
        ticket: "0 30px 80px -20px rgba(0, 0, 0, 0.65)",
        lime: "0 0 0 1px rgba(138, 255, 60, 0.2), 0 20px 60px -25px rgba(138, 255, 60, 0.35)",
      },
      animation: {
        marquee: "marquee 34s linear infinite",
        pulseSoft: "pulseSoft 2.6s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.82)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
