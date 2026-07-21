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
          bg: '#0a0b10',       // Deep cyber void
          card: 'rgba(17, 19, 31, 0.75)', // Glass container
          border: 'rgba(255, 255, 255, 0.08)',
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
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'cyber-glow 2s ease-in-out infinite alternate',
        'wave': 'wave-animation 1.5s ease-in-out infinite',
      },
      keyframes: {
        'cyber-glow': {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)' }
        },
        'wave-animation': {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1.0)' }
        }
      }
    },
  },
  plugins: [],
}
