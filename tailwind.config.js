/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './mcp-app.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        surface: {
          DEFAULT: 'var(--mcp-surface)',
          elevated: 'var(--mcp-surface-elevated)',
          warm: 'var(--mcp-surface-warm)',
        },
        // Text
        text: {
          DEFAULT: 'var(--mcp-text-primary)',
          primary: 'var(--mcp-text-primary)',
          secondary: 'var(--mcp-text-secondary)',
          muted: 'var(--mcp-text-muted)',
        },
        // Accent
        accent: {
          DEFAULT: 'var(--mcp-accent)',
          hover: 'var(--mcp-accent-hover)',
          subtle: 'var(--mcp-accent-subtle)',
          muted: 'var(--mcp-accent-muted)',
        },
        // Borders
        border: {
          DEFAULT: 'var(--mcp-border)',
          subtle: 'var(--mcp-border-subtle)',
          focus: 'var(--mcp-border-focus)',
        },
        // Selection
        selected: {
          bg: 'var(--mcp-selected-bg)',
          border: 'var(--mcp-selected-border)',
        },
        // Success
        success: {
          DEFAULT: 'var(--mcp-success)',
          bg: 'var(--mcp-success-bg)',
        },
      },
      boxShadow: {
        'sm': 'var(--mcp-shadow-sm)',
        'md': 'var(--mcp-shadow-md)',
        'focus': 'var(--mcp-shadow-focus)',
      },
      fontFamily: {
        sans: ["'Söhne'", '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25rem' }],
        'sm': ['0.8125rem', { lineHeight: '1.375rem' }],
        'base': ['0.9375rem', { lineHeight: '1.5rem' }],
        'lg': ['1.0625rem', { lineHeight: '1.625rem' }],
      },
      borderRadius: {
        'pill': '9999px',
      },
      animation: {
        'fade-in': 'fadeSlideIn 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
