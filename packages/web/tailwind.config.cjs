/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line no-undef
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		// fontFamily: {
		// 	sans: [
		// 		'ui-rounded',
		// 		'Hiragino Maru Gothic ProN',
		// 		'Quicksand',
		// 		'Comfortaa',
		// 		'Manjari',
		// 		'Arial Rounded MT Bold',
		// 		'Calibri',
		// 		'source-sans-pro',
		// 		'sans-serif',
		// 	],
		// 	tutorial: ['system-ui', 'sans-serif'],
		// },
		extend: {
			borderWidth: {
				1: '1px',
				6: '6px',
			},
			fontWeight: {
				'extra-light': 200,
				light: 300,
				normal: 400,
				medium: 500,
				semibold: 600,
				bold: 700,
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
	],
};
