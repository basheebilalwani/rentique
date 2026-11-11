/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FBF9F5',
          100: '#F5EFE6',
          200: '#EBDDC9',
          300: '#DEC4A4',
          400: '#CDA679',
          500: '#B8874E',
          600: '#9E6D38',
          700: '#7E5229',
          800: '#5E3C1F',
          900: '#3D2714',
        },
        charcoal: {
          50: '#F6F6F7',
          100: '#E7E8EA',
          200: '#CFD1D6',
          300: '#AAB0BB',
          400: '#7F8796',
          500: '#5F6777',
          600: '#484E5D',
          700: '#353945',
          800: '#23262F',
          900: '#14161B',
          950: '#0B0C0E',
        },
        champagne: {
          50: '#FDFBF7',
          100: '#FAF6ED',
          200: '#F3EADB',
          300: '#E9D9C1',
          400: '#DCC3A1',
          500: '#C7A97E',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'luxury': '0 4px 20px -2px rgba(20, 22, 27, 0.05), 0 2px 6px -1px rgba(20, 22, 27, 0.03)',
        'luxury-hover': '0 12px 30px -4px rgba(20, 22, 27, 0.1), 0 4px 10px -2px rgba(20, 22, 27, 0.05)',
        'gold-glow': '0 0 25px -5px rgba(184, 135, 78, 0.25)',
      },
      borderRadius: {
        'luxury': '14px',
        'luxury-lg': '20px',
      }
    },
  },
  plugins: [],
}
