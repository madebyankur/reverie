/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx}',
		'./demo/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			animation: {
				'widget-enter': 'widget-enter 0.3s ease-out',
				'widget-exit': 'widget-exit 0.2s ease-in',
			},
			keyframes: {
				'widget-enter': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9) translateY(10px)',
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1) translateY(0)',
					},
				},
				'widget-exit': {
					'0%': {
						opacity: '1',
						transform: 'scale(1) translateY(0)',
					},
					'100%': {
						opacity: '0',
						transform: 'scale(0.9) translateY(10px)',
					},
				},
			},
			zIndex: {
				'widget': '9999',
			},
		},
	},
	plugins: [],
}