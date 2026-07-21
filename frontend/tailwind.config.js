/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#08090d',       // Deep cyber black
          card: 'rgba(13, 15, 24, 0.75)', // Glass container
          border: 'rgba(255, 255, 255, 0.06)',
          neonGreen: '#10b981', // Clean safety
          neonYellow: '#f59e0b',// Warning caution
          neonRed: '#ef4444',   // Threat breach
          indigoGlow: '#6366f1',
          accent: '#8b5cf6'
        }
      },
      boxShadow: {
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.35)',
        'glow-yellow': '0 0 15px rgba(245, 158, 11, 0.35)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3)'
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'cyber-glow 2s ease-in-out infinite alternate',
        'wave': 'wave-animation 1.5s ease-in-out infinite',
        'bounce-short': 'bounce-short 1.5s ease-in-out infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'scanline': 'scanline 10s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'text-glitch': 'text-glitch 3s linear infinite'
      },
      keyframes: {
        'cyber-glow': {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)' }
        },
        'wave-animation': {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1.0)' }
        },
        'bounce-short': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'text-glitch': {
          '0%, 100%': { textShadow: '2px 0 0 rgba(255,0,0,0.5), -2px 0 0 rgba(0,0,255,0.5)' },
          '25%': { textShadow: '-2px 0 0 rgba(255,0,0,0.5), 2px 0 0 rgba(0,0,255,0.5)' },
          '50%': { textShadow: '2px -2px 0 rgba(255,0,0,0.5), -2px 2px 0 rgba(0,0,255,0.5)' },
          '75%': { textShadow: '-2px 2px 0 rgba(255,0,0,0.5), 2px -2px 0 rgba(0,0,255,0.5)' }
        }
      }
    },
  },
  plugins: [],
}
