module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors:{
				'regal-blue': '#1E2142',
				'regarl-voilet': '#3152DF',
				'secondary':'#6AAAF0',
				'highlight': '#4ACAE2',
				'gradient-start': '#59A2F8',
				'gradient-end': '#4ACAE2',
			},
		},
		container: {
			center: true,
		},
	},
	plugins: [],
};
