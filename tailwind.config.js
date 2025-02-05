/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			inter: [
  				'Inter',
  				'sans-serif'
  			],
  			italian: [
  				'Italiana',
  				'sans-serif'
  			],
  			aborato: [
  				'Aboreto',
  				'sans-serif'
  			],
  			Lumanosimo: [
  				'Lumanosimo',
  				'sans-serif'
  			],
  			roboto: [
  				'Roboto',
  				'sans-serif'
  			],
  			popin: [
  				'Poppins',
  				'sans-serif'
  			],
  			antiqua: [
  				'Inknut',
  				'sans-serif'
  			],
  			raleway: [
  				'Raleway',
  				'sans-serif'
  			],
  			acme: [
  				'Acme',
  				'sans-serif'
  			],
  			jakarta: [
  				'Plus Jakarta Sans',
  				'sans-serif'
  			],
  			playfair: [
  				'Playfair Display',
  				'sans-serif'
  			]
  		},
  		colors: {
  			dark_red: '#990000',
  			light_red: '#DF5757',
  			red_FA0000: '#FA0000',
  			aash: '#BAA3A3',
  			input_dark: '#700303',
  			red_Active: '#E82A2A',
  			otp_red: '#3E1111',
  			admin_panel_Blue: '#2b5bee',
  			'dark-blue': '#0b3e80',
  			'theme-blue': '#007bff',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			'3xl': '0 4px 12px 0 rgba(0, 0, 0, 0.8), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    function({addUtilities}){
      addUtilities({
        '.no-scrollbar':{
          '-webkit-overflow-scrolling': 'touch',
          'scrollbar-width': 'none', 
          '-ms-overflow-style': 'none', 
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
      })
    },
      require("tailwindcss-animate")
],
}
