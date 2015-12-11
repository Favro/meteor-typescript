Package.describe({
	name: "hansoft:typescript",
	summary: "TypeScript is a staticaly typed superset of JavaScript",
	git: "https://github.com/Hansoft/meteor-typescript.git",
	version: "1.1.1"
});

Package.registerBuildPlugin({
	name: "compileTypescript",
	use: ["meteor"],
	sources: [
		"plugin/compile-typescript.js"
	],
	npmDependencies: {
		"typescript": "1.7.3",
	}
});
