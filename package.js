Package.describe({
	name: "favro:typescript",
	summary: "TypeScript is a staticaly typed superset of JavaScript",
	git: "https://github.com/Favro/meteor-typescript.git",
	version: "1.6.0",
});

Package.registerBuildPlugin({
	name: "compileTypescript",
	use: ["meteor"],
	sources: [
		"plugin/compile-typescript.js"
	],
	npmDependencies: {
		"typescript": "2.6.2",
	},
});
