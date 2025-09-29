/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', 'class'],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			card: 'var(--card)',
  			'card-foreground': 'var(--card-foreground)',
  			popover: 'var(--popover)',
  			'popover-foreground': 'var(--popover-foreground)',
  			primary: {
  				'50': '#f5f3ff',
  				'100': '#ede9fe',
  				'200': '#ddd6fe',
  				'300': '#c4b5fd',
  				'400': '#a78bfa',
  				'500': '#8b5cf6',
  				'600': '#7c3aed',
  				'700': '#6d28d9',
  				'800': '#5b21b6',
  				'900': '#4c1d95',
  				'950': '#2e1065',
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				'50': '#eef2ff',
  				'100': '#e0e7ff',
  				'200': '#c7d2fe',
  				'300': '#a5b4fc',
  				'400': '#818cf8',
  				'500': '#6366f1',
  				'600': '#4f46e5',
  				'700': '#4338ca',
  				'800': '#3730a3',
  				'900': '#312e81',
  				'950': '#1e1b4b',
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			dark: {
  				'100': '#1e1e2d',
  				'200': '#1a1a27',
  				'300': '#151521',
  				'400': '#13131f',
  				'500': '#0f0f17',
  				'600': '#0c0c12',
  				'700': '#09090e',
  				'800': '#060609',
  				'900': '#030305'
  			},
  			'color-1': 'hsl(var(--color-1))',
  			'color-2': 'hsl(var(--color-2))',
  			'color-3': 'hsl(var(--color-3))',
  			'color-4': 'hsl(var(--color-4))',
  			'color-5': 'hsl(var(--color-5))',
  			
  			/* Design System Colors */
  			surface: 'var(--surface)',
  			'surface-variant': 'var(--surface-variant)',
  			'text-primary': 'var(--text-primary)',
  			'text-secondary': 'var(--text-secondary)',
  			'text-muted': 'var(--text-muted)',
  			'text-accent': 'var(--text-accent)',
  			'border-subtle': 'var(--border-subtle)',
  			'border-medium': 'var(--border-medium)',
  			'border-accent': 'var(--border-accent)',
  			'accent-hover': 'var(--accent-hover)',
  			
  			/* Design System Primary Colors */
  			'design-primary': {
  				'background': '#0A0B0D',
  				'surface': '#1A1B1F',
  				'surface-variant': '#2A2B2F',
  				'accent': '#0066FF',
  				'accent-hover': '#0052CC'
  			},
  			'design-text': {
  				'primary': '#FFFFFF',
  				'secondary': '#B8BCC8',
  				'muted': '#8B8FA3',
  				'accent': '#00D4FF'
  			},
  			'design-borders': {
  				'subtle': '#2A2B2F',
  				'medium': '#3A3B3F',
  				'accent': '#0066FF'
  			}
  		},
  		borderRadius: {
  			DEFAULT: 'var(--radius)'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  			'gradient-hero': 'var(--gradient-hero)',
  			'gradient-section': 'var(--gradient-section)',
  			'gradient-text': 'var(--gradient-text)'
  		},
  		boxShadow: {
  			'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
  			'subtle': 'var(--shadow-subtle)',
  			'medium': 'var(--shadow-medium)',
  			'large': 'var(--shadow-large)'
  		},
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        'auto': 'auto',
        'beam': '5',
        'beam-content': '10',
      },
  		keyframes: {
  			'aurora-border': {
  				'0%, 100%': {
  					borderRadius: '37% 29% 27% 27% / 28% 25% 41% 37%'
  				},
  				'25%': {
  					borderRadius: '47% 29% 39% 49% / 61% 19% 66% 26%'
  				},
  				'50%': {
  					borderRadius: '57% 23% 47% 72% / 63% 17% 66% 33%'
  				},
  				'75%': {
  					borderRadius: '28% 49% 29% 100% / 93% 20% 64% 25%'
  				}
  			},
  			'aurora-1': {
  				'0%, 100%': {
  					top: '0',
  					right: '0'
  				},
  				'50%': {
  					top: '50%',
  					right: '25%'
  				},
  				'75%': {
  					top: '25%',
  					right: '50%'
  				}
  			},
  			'aurora-2': {
  				'0%, 100%': {
  					top: '0',
  					left: '0'
  				},
  				'60%': {
  					top: '75%',
  					left: '25%'
  				},
  				'85%': {
  					top: '50%',
  					left: '50%'
  				}
  			},
  			'aurora-3': {
  				'0%, 100%': {
  					bottom: '0',
  					left: '0'
  				},
  				'40%': {
  					bottom: '50%',
  					left: '25%'
  				},
  				'65%': {
  					bottom: '25%',
  					left: '50%'
  				}
  			},
  			'aurora-4': {
  				'0%, 100%': {
  					bottom: '0',
  					right: '0'
  				},
  				'50%': {
  					bottom: '25%',
  					right: '40%'
  				},
  				'90%': {
  					bottom: '50%',
  					right: '25%'
  				}
  			},
        'shine': {
          '0%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' }
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-100%)' }
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
  		},
      animation: {
        'shine': 'shine var(--duration, 14s) linear infinite',
        'marquee': 'marquee var(--duration, 40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite',
        'ripple': 'ripple 3s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      },
      typography: {
        'hero': {
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: '700',
          lineHeight: '1.1',
          letterSpacing: '-0.02em'
        },
        'heading-1': {
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: '600',
          lineHeight: '1.2',
          letterSpacing: '-0.015em'
        },
        'heading-2': {
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: '600',
          lineHeight: '1.3'
        },
        'body': {
          fontSize: '1.125rem',
          fontWeight: '400',
          lineHeight: '1.6'
        },
        'body-small': {
          fontSize: '1rem',
          fontWeight: '400',
          lineHeight: '1.5'
        }
      }
  	}
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};