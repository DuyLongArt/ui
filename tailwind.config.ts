import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',
      'phone': {'max': '300px'},
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1600px',
    },
    extend: {
      // 2. Move textShadow OUT of colors
      textShadow: {
        'sm': '1px 1px 2px rgba(0, 0, 0, 0.5)',
        'default': '2px 2px 4px rgba(0, 0, 0, 0.3)',
        'lg': '4px 4px 8px rgba(0, 0, 0, 0.4)',
        'great': '8px 8px 8px rgba(0,0,0,1)'
      },
      colors: {
        primary: {
          50: '#eff6ff', // ... rest of your colors
          500: '#3b82f6',
        },
        secondary: {
          50: '#f8fafc', // ... rest of your colors
          500: '#64748b',
        },
      },
      boxShadow: {
        'glass-edge': '0 0 10px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.05), 0 0 30px rgba(0, 0, 0, 0.02)',
        'glass': '0 0 10px rgba(255, 255, 255, 0.7), 0 0 30px rgba(0, 0, 0, 1)',
        'inner-lg': 'none',
        'outline': 'none',
      },
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Fira Code', 'monospace'],
    },
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem' }],
      'sm': ['0.875rem', { lineHeight: '1.25rem' }],
      'base': ['1rem', { lineHeight: '1.5rem' }],
      'lg': ['1.125rem', { lineHeight: '1.75rem' }],
      'xl': ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },
    spacing: {
      '18': '4.5rem',
      '88': '22rem',
      '128': '32rem',
    },
    borderRadius: {
      '4xl': '2rem',
    },
    boxShadow: {
      'inner-lg': 'none',
      'outline': 'none',
    },
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'slide-up': 'slideUp 0.3s ease-out',
      'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': { transform: 'translateY(100%)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
    },

    zIndex: {
      '60': '60',
      '70': '70',
      '80': '80',
      '90': '90',
      '100': '100',
    },
},
  plugins: [
    // Uncomment and install these plugins as needed:
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
    require('tailwindcss-text-shadow')
  ],
  // Enable dark mode
  darkMode: 'class', // or 'media' for system preference
}
export default config