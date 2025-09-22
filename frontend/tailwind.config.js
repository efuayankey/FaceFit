/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f8ff',
          500: '#007bff',
          600: '#0056b3',
          700: '#004085',
        },
        success: {
          500: '#28a745',
          600: '#1e7e34',
        },
        warning: {
          500: '#ffc107',
        },
        danger: {
          500: '#dc3545',
          600: '#c82333',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
      }
    },
  },
  plugins: [],
}