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
        // Root Semantic Tokens (Auto-adapts to Light / Dark Theme)
        canvas: {
          DEFAULT: 'var(--bg-page)',
          subtle: 'var(--bg-page-subtle)',
        },
        surface: {
          DEFAULT: 'var(--bg-surface)',
          card: 'var(--bg-surface)',
          elevated: 'var(--bg-surface-elevated)',
          inset: 'var(--bg-surface-inset)',
          hover: 'var(--bg-surface-hover)',
          input: 'var(--bg-input)',
          'input-disabled': 'var(--bg-input-disabled)',
          ai: 'var(--bg-ai-surface)',
        },
        content: {
          DEFAULT: 'var(--text-primary)',
          main: 'var(--text-primary)',
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
          inverse: 'var(--text-inverse)',
          ai: 'var(--text-ai)',
          'ai-muted': 'var(--text-ai-muted)',
        },
        line: {
          DEFAULT: 'var(--border-subtle)',
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
          active: 'var(--border-active)',
          ai: 'var(--border-ai)',
          glass: 'var(--border-subtle)',
        },
        badge: {
          'success-bg': 'var(--badge-success-bg)',
          'success-text': 'var(--badge-success-text)',
          'success-border': 'var(--badge-success-border)',
          'warning-bg': 'var(--badge-warning-bg)',
          'warning-text': 'var(--badge-warning-text)',
          'warning-border': 'var(--badge-warning-border)',
          'danger-bg': 'var(--badge-danger-bg)',
          'danger-text': 'var(--badge-danger-text)',
          'danger-border': 'var(--badge-danger-border)',
          'info-bg': 'var(--badge-info-bg)',
          'info-text': 'var(--badge-info-text)',
          'info-border': 'var(--badge-info-border)',
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

