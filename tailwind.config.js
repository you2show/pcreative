/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './constants.tsx',
    './types.ts',
    './components/**/*.{js,ts,jsx,tsx}',
    './contexts/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Kantumruy Pro', 'system-ui', 'sans-serif'],
        khmer: ['Kantumruy Pro', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#000000',
        },
        dark: {
          bg: '#000000',
          card: '#050505',
          border: '#111111',
          hover: '#1a1a1a',
        }
      },
      letterSpacing: {
        'ultra-tight': '-.08em',
        'tightest': '-.05em',
        'tighter': '-.03em',
        'loose': '.2em',
        'widest': '.4em',
      },
      lineHeight: {
        'extra-tight': '0.9',
      },
      boxShadow: {
        'premium': '0 0 1px 0 rgba(255, 255, 255, 0.1), 0 32px 64px -16px rgba(0, 0, 0, 0.4)',
        'premium-hover': '0 0 1px 0 rgba(255, 255, 255, 0.2), 0 48px 96px -24px rgba(0, 0, 0, 0.6)',
        'soft-glow': '0 0 40px -10px rgba(99, 102, 241, 0.1)',
      },
      animation: {
        'reveal-up': 'revealUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slow-zoom': 'slowZoom 20s ease-out infinite alternate',
      },
      keyframes: {
        revealUp: {
          '0%': { transform: 'translateY(110%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
        'gradient-dark': 'linear-gradient(to bottom, #050505, #000000)',
        'mask-bottom': 'linear-gradient(to bottom, transparent, #000000)',
      },
    },
  },
  plugins: [],
}
