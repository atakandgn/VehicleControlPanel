module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
              primary: '#171717',
              secondary: '#201d24',
              tertiary: '#2b2934',
              textColor: '#ffffff',
              blueColorDark: '#1e1b4b',
              blueColorLight: '#312e81',
              yellowColor: '#f59e0b',
              lightBlue:'#1d4ed8',
              hoverLightBlue: '#2563eb',
            },
            screens: {
                'xs': '500px',
                // => @media (min-width: 500px) { ... }
                
                'sm': '640px',
                // => @media (min-width: 640px) { ... }

                'md': '768px',
                // => @media (min-width: 768px) { ... }

                'lg': '1024px',
                // => @media (min-width: 1024px) { ... }

                'xl': '1280px',
                // => @media (min-width: 1280px) { ... }

                '2xl': '1536px',
                // => @media (min-width: 1536px) { ... }

                'xs-sm': {'min': '500px', 'max': '640px'},
                // => @media (min-width: 500px) and (max-width:640px) { ... }
            },
            animation: {
                focusAnimation: 'focusAnimation 0.5s ease-in-out',
              },
              keyframes: {
                focusAnimation: {
                  '0%, 100%': { transform: 'scale(1)', boxShadow: 'none' },
                  '50%': { transform: 'scale(1.01)', boxShadow: '0 0 15px rgba(0, 123, 255, 0.5)' },
                },
              },
            },
    },
    plugins: [
    ],
};
