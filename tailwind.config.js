/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT:  '#0E0F1A',
          raised:   '#13141F',
          card:     '#181926',
          hover:    '#1E1F2E',
          border:   'rgba(255,255,255,0.07)',
          bordermid:'rgba(255,255,255,0.11)',
        },
        violet: {
          DEFAULT:  '#6C47FF',
          light:    '#8B6FFF',
          bright:   '#B3A0FF',
          dark:     '#4C2ECC',
          muted:    'rgba(108,71,255,0.12)',
          border:   'rgba(108,71,255,0.22)',
          glow:     'rgba(108,71,255,0.28)',
        },
        blue: {
          DEFAULT:  '#2563EB',
          light:    '#60A5FA',
          muted:    'rgba(37,99,235,0.12)',
        },
        snow: {
          DEFAULT:  '#F0F2FF',
          dim:      '#9AA0C0',
          muted:    '#555A7A',
        },
        green: {
          DEFAULT:  '#10B981',
          muted:    'rgba(16,185,129,0.12)',
          border:   'rgba(16,185,129,0.25)',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'brand-grad':  'linear-gradient(135deg, #4C2ECC 0%, #6C47FF 50%, #2563EB 100%)',
        'brand-grad-h':'linear-gradient(90deg, #4C2ECC 0%, #6C47FF 100%)',
        'hero-glow':   'radial-gradient(ellipse 60% 50% at 65% 40%, rgba(108,71,255,0.10) 0%, transparent 60%)',
        'dot-grid':    'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
      boxShadow: {
        'brand':    '0 0 40px rgba(108,71,255,0.20)',
        'brand-lg': '0 0 80px rgba(108,71,255,0.28)',
        'brand-sm': '0 0 14px rgba(108,71,255,0.14)',
        'brand-btn':'0 8px 28px rgba(76,46,204,0.45)',
        'card':     '0 1px 3px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.20)',
        'card-md':  '0 2px 8px rgba(0,0,0,0.35), 0 8px 32px rgba(0,0,0,0.25)',
      },
      animation: {
        'shimmer':  'shimmer 3s linear infinite',
        'ticker':   'ticker 26s linear infinite',
        'pulse-v':  'pulseV 2s ease-in-out infinite',
        'float':    'float 7s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-300% center' },
          '100%': { backgroundPosition:  '300% center' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseV: {
          '0%,100%': { opacity: 1 },
          '50%':     { opacity: 0.4 },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}