import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Updated AMPLY Brand Colors
        "amply-orange": "#FF8C00",
        "amply-pink": "#FF0080",
        "amply-pink-light": "#fdc2db", // New lighter pink for gradients
        "amply-black": "#000000",
        "amply-cream": "#FDF9F2",
        "amply-beige": "#F5EFDF",
        "amply-white": "#FFFFFF",
        "amply-gray": "#F8F9FA",
        "amply-gray-light": "#FAFBFC",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
      },
      animation: {
        "gentle-float": "gentle-float 3s ease-in-out infinite",
        "soft-pulse": "soft-pulse 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
      },
      keyframes: {
        "gentle-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "amply-gradient": "linear-gradient(135deg, #FDF9F2 0%, #F8F9FA 100%)",
        "amply-gradient-soft": "linear-gradient(135deg, #FF8C00 0%, #fdc2db 100%)",
        "amply-gradient-pink": "linear-gradient(135deg, #FF0080 0%, #fdc2db 100%)",
        "amply-gradient-light": "linear-gradient(135deg, #FAFBFC 0%, #FDF9F2 100%)",
      },
      boxShadow: {
        amply: "0 4px 20px rgba(255, 140, 0, 0.08)",
        "amply-lg": "0 8px 30px rgba(255, 140, 0, 0.12)",
        "amply-pink": "0 4px 20px rgba(255, 0, 128, 0.08)",
        soft: "0 2px 15px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 4px 20px rgba(0, 0, 0, 0.08)",
        minimal: "0 1px 2px rgba(0, 0, 0, 0.05)",
      },
      minHeight: {
        touch: "44px", // Minimum touch target size
        "screen-safe": "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config