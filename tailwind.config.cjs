/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E30613',
        andesnavy: '#013170',
        tmbgreen: '#8dc63f',
        tmbred: '#D2042D',
        tmbyellow: '#ffde00',
        tmbviolet: '#8C2EFF',
        tmbbbyblue:'#1097f6'
      },
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        rubikOne: ['Rubik One', 'sans-serif'],
        rubikMono: ['Rubik Mono One', 'sans-serif'],
        gothic: ['Special Gothic Expanded One', 'sans-serif'],
      },
      fontSize: {
        'mission': 'clamp(1.5rem, 5vw, 3rem)'
      },
      skew: {
        2: '2deg',
        '-2': '-2deg'
      },
      animation: {
        fade: 'fade 1s ease-in-out'
      },
      keyframes: {
        fade: {
          '0%,100%': { opacity: 0 },
          '50%': { opacity: 1 }
        }
      }
    }
  },
  plugins: []
}
