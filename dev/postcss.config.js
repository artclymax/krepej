export default {
	plugins: {
		autoprefixer: {},
		"postcss-pxtorem": {
			rootValue: 16,
			propList: [
				"*font*",
				"*size*",
				"line-height",
				"margin*",
				"padding*",
				"top",
				"left",
				"right",
				"bottom",
				"width",
				"height",
				"max-width",
				"min-width",
				"max-height",
				"min-height",
			],
			minPixelValue: 2,
			unitPrecision: 5,
			mediaQuery: true,
			selectorBlackList: ["html", "no-rem"],
		},
	},
};
