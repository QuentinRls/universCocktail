/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        'base': '230px',
      },
      colors: {
        space: {
          dark: '#0a0a1a',
          nebula: '#1e0a3a', 
          purple: '#6b1dce',
          blue: '#1a4fdf',
          cyan: '#19d2e5',
          pink: '#e52c9d',
          star: '#f8f5ff'
        }
      },
      backgroundImage: {
        'stars': 'url("/stars-bg.png")',
        'galaxy': 'linear-gradient(to right, #0a0a1a, #1e0a3a, #0a0a1a)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        futuristic: ['Space Grotesk', 'sans-serif'],
        title: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 5s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    }
  },
  plugins: [],
}