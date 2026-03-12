import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0B",
        surface: {
          DEFAULT: "#18181B",
          elevated: "#27272A",
        },
        primary: {
          DEFAULT: "#F59E0B",
          dark: "#D97706",
          glow: "#FCD34D",
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#A1A1AA",
        },
        accent: {
          like: "#EC4899",
          dislike: "#6B7280",
          success: "#10B981",
          rating: "#FBBF24",
        },
      },
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
        pulse: "pulse 2s infinite",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
