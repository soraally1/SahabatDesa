/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        float: 'float 6s ease-in-out infinite',
        fadeOut: 'fadeOut 0.5s ease-out forwards',
        slideRight: 'slideRight 0.5s ease-out forwards',
        slideLeft: 'slideLeft 0.5s ease-out forwards',
        slideUp: 'slideUp 0.5s ease-out forwards',
        loadingBar: 'loadingBar 2s ease-in-out infinite',
        shine: 'shine 1.5s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'floatBackground': 'floatBackground 10s ease-in-out infinite',
        'rubber': 'rubber 1.5s ease-in-out infinite',
        'jello': 'jello 2s infinite',
        'swing': 'swing 2s ease-in-out infinite',
        'pop': 'pop 0.5s ease-out forwards',
        'bounce-custom': 'bounce-custom 2s infinite',
        'bounce-rotate': 'bounce-rotate 2s infinite',
        'bounce-scale': 'bounce-scale 2s infinite',
        'letter-bounce': 'letter-bounce 1s infinite',
        'letter-pop-in': 'letter-pop-in 0.5s ease-out forwards',
        'letter-bounce-in': 'letter-bounce-in 0.5s cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards',
        'letter-float': 'letter-float 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0', visibility: 'hidden' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        floatBackground: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
        },
        rubber: {
          '0%': { transform: 'scale3d(1, 1, 1)' },
          '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
          '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
          '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
          '65%': { transform: 'scale3d(0.95, 1.05, 1)' },
          '75%': { transform: 'scale3d(1.05, 0.95, 1)' },
          '100%': { transform: 'scale3d(1, 1, 1)' },
        },
        jello: {
          '0%, 100%': { transform: 'scale3d(1, 1, 1)' },
          '30%': { transform: 'scale3d(1.25, 0.75, 1)' },
          '40%': { transform: 'scale3d(0.75, 1.25, 1)' },
          '50%': { transform: 'scale3d(1.15, 0.85, 1)' },
          '65%': { transform: 'scale3d(.95, 1.05, 1)' },
          '75%': { transform: 'scale3d(1.05, .95, 1)' },
          '100%': { transform: 'scale3d(1, 1, 1)' },
        },
        swing: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '20%': { transform: 'rotate(15deg)' },
          '40%': { transform: 'rotate(-10deg)' },
          '60%': { transform: 'rotate(5deg)' },
          '80%': { transform: 'rotate(-5deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-custom': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25px)' },
        },
        'bounce-rotate': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(8deg)' },
        },
        'bounce-scale': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.1)' },
        },
        'letter-bounce': {
          '0%, 100%': { 
            transform: 'translateY(0)',
            textShadow: '0 4px 8px rgba(0,0,0,0.2)'
          },
          '50%': { 
            transform: 'translateY(-15px)',
            textShadow: '0 15px 10px rgba(0,0,0,0.15)'
          },
        },
        'letter-pop-in': {
          '0%': { 
            transform: 'scale(0) translateY(40px)',
            opacity: '0',
          },
          '60%': { 
            transform: 'scale(1.2) translateY(-10px)',
            opacity: '0.7',
          },
          '100%': { 
            transform: 'scale(1) translateY(0)',
            opacity: '1',
          },
        },
        'letter-bounce-in': {
          '0%': {
            transform: 'translateY(100%) scale(0)',
            opacity: '0',
          },
          '60%': {
            transform: 'translateY(-20%) scale(1.1)',
            opacity: '0.7',
          },
          '100%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
        },
        'letter-float': {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)',
            textShadow: '0 5px 10px rgba(0,0,0,0.2)',
          },
          '50%': {
            transform: 'translateY(-10px) rotate(3deg)',
            textShadow: '0 15px 15px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
  plugins: [],
}