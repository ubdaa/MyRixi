/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--foreground))",
          },
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
        },
        keyframes: {
          "fade-in": {
            "0%": { opacity: 0, transform: "translateY(20px)" },
            "100%": { opacity: 1, transform: "translateY(0)" },
          },
          "pulse-glow": {
            "0%, 100%": { opacity: 0.8 },
            "50%": { opacity: 1 },
          },
        },
        animation: {
          "fade-in": "fade-in 0.6s ease-out forwards",
          "pulse-glow": "pulse-glow 3s infinite",
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          cyber: ['Orbitron', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }