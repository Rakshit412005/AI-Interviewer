/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // Vivid Emerald
          600: '#059669', // Core Tech Green
          700: '#047857', // Medium-Deep Green
          800: '#065f46', // Rich Forest-Emerald
          900: '#064e3b', // Deep Emerald Accent
          950: '#032d23', // Ultra-Deep Base
        },
        emerald: {
          vibrant: '#10b981',
          mint: '#34d399',
          soft: '#a7f3d0',
          deep: '#047857',
        },
        teal: {
          tech: '#0d9488',
          vibrant: '#14b8a6',
          soft: '#99f6e4',
        },
        canvas: {
          DEFAULT: 'var(--color-canvas)',
          subtle: 'var(--color-canvas-subtle)',
        },
        surface: {
          DEFAULT: 'var(--color-surface-card)',
          elevated: 'var(--color-surface-elevated)',
          card: 'var(--color-surface-card)',
          inset: 'var(--color-surface-inset)',
          hover: 'var(--color-surface-hover)',
        },
        content: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
          subtle: 'var(--color-text-subtle)',
          inverse: 'var(--color-text-inverse)',
        },
        line: {
          subtle: 'var(--color-border-subtle)',
          glass: 'var(--color-border-subtle)',
          active: 'var(--color-border-active)',
        },
      },
      boxShadow: {
        'sm-subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card-elevated': '0 4px 20px -2px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.08)',
        'glass-nav': '0 4px 20px -1px rgba(0, 0, 0, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'glow-emerald': '0 0 20px -2px rgba(16, 185, 129, 0.35)',
        'glow-subtle': '0 0 12px 0 rgba(16, 185, 129, 0.20)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))' },
        },
      },
    },
  },
  plugins: [],
}

