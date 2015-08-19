Package.describe({
	name: "hansoft:typescript",
	summary: "TypeScript is a staticaly typed superset of JavaScript",
	git: "https://github.com/Hansoft/meteor-typescript",
	version: "1.0.0"
});

Package.registerBuildPlugin({
	name: "compileTypescript",
	use: ["meteor"],
	sources: [
		"plugin/compile-typescript.js"
	],
	npmDependencies: {
		"typescript": "1.5.3",
	}
});
