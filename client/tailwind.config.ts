import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './styles/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#05060a',
        surface: '#0d111a',
        accent: {
          DEFAULT: '#67e8f9',
          foreground: '#041c24'
        }
      },
      boxShadow: {
        glow: '0 0 40px rgba(103, 232, 249, 0.35)'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 }
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite'
      }
    },
    fontFamily: {
      sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif']
    }
  },
  plugins: []
}

export default config
