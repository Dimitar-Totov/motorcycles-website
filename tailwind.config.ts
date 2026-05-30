import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        digitEnter: {
          '0%': {
            opacity: '0',
            transform: 'perspective(500px) rotateX(18deg) rotateY(-10deg) translateY(-40px)',
          },
          '100%': {
            opacity: '1',
            transform: 'perspective(500px) rotateX(18deg) rotateY(-10deg) translateY(0px)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
      },
      animation: {
        'digit-enter': 'digitEnter 0.6s ease-out both',
        float: 'float 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [typography],
};

export default config;
