Package.describe({
	name: "hansoft:typescript",
	summary: "TypeScript is a staticaly typed superset of JavaScript",
	version: "1.0.0"
	git: "https://github.com/Hansoft/meteor-typescript.git",
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
