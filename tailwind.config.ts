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
        background: "#FAF8F5",
        foreground: "#1D1C1A",
        brand: {
          bone: "#FAF8F5",
          parchment: "#F5F2EB",
          sand: "#EDE8E0",
          sandDark: "#DFD8CD",
          charcoal: "#1D1C1A",
          charcoalSoft: "#2E2C29",
          charcoalMuted: "#6B6661",
          stoneLight: "#969089",
          stoneBorder: "#E7E2D9",
          stoneBorderSoft: "#EFECE6",
          terracotta: {
            DEFAULT: "#C47D68",
            light: "#DF9B87",
            dark: "#9E5D4A",
            soft: "#F8ECE7",
            hover: "#B6715C",
          },
          overlay: {
            pores: "#C98B72",
            wrinkles: "#8E8276",
            blackheads: "#5F7065",
            whiteheads: "#B3A596",
            inflammatory_acne: "#C36F65",
            puffy_eyes: "#9589A0",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Didot", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "soft-sm": "0 2px 8px -2px rgba(29, 28, 26, 0.04)",
        "soft": "0 8px 24px -4px rgba(29, 28, 26, 0.05)",
        "soft-md": "0 12px 32px -6px rgba(29, 28, 26, 0.07)",
        "soft-lg": "0 20px 48px -10px rgba(29, 28, 26, 0.08)",
        "ambient": "0 0 40px -10px rgba(196, 125, 104, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "subtle-pulse": "subtlePulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        subtlePulse: {
          "0%, 100%": { opacity: "0.85", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.01)" },
        },
      },
      borderRadius: {
        "editorial": "14px",
      },
    },
  },
  plugins: [],
};

export default config;
