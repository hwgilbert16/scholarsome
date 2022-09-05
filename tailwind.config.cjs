module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/@brainandbones/skeleton/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [require("@brainandbones/skeleton/tailwind.cjs")]
};
