var fs = Npm.require("fs");
var typescript = Npm.require("typescript");

var fullInputPaths = [];
var inputPathToFullPathMap = {};

var sourceMapReferenceLineRegExp = new RegExp("//# sourceMappingURL=.*$", "m");

Plugin.registerSourceHandler("ts", function(compileStep) {
	fullInputPaths.push(compileStep.fullInputPath);
	inputPathToFullPathMap[compileStep.inputPath] = compileStep.fullInputPath;
});

Plugin.registerSourceHandler("ts-build", function(compileStep) {
	var options = {
		out: "out.js",
		target: 1,
		sourceMap: true,
		removeComments: true,
		noEmitOnError: true,
	};

	var source = "";
	var sourceMap = "";

	var compilerHost = typescript.createCompilerHost(options);
	compilerHost.writeFile = function(fileName, data, writeByteOrderMark, onError) {
		if (fileName == "out.js")
			source = data;
		else
			sourceMap = data;
	};

	var program = typescript.createProgram(fullInputPaths, options, compilerHost);
	var emitResult = program.emit();

	var allDiagnostics = typescript.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

	allDiagnostics.forEach(function(diagnostic) {
		var lineAndCharacter = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
		var line = lineAndCharacter.line + 1;
		var character = lineAndCharacter.character + 1;
		var diagnosticCategory = typescript.DiagnosticCategory[diagnostic.category];
		var message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
		var formattedMessage = diagnostic.file.fileName + ":" + line + ":" + character + ": " + diagnosticCategory + " TS" + diagnostic.code + ": " + message;

		compileStep.error({
			message: formattedMessage,
		});
	});

	if (!emitResult.emitSkipped) {
		// Remove source map reference line from generated js file.
		// Meteor sets up source map through HTTP response header instead.
		// FIXME: Should be an option for TypeScript compiler.
		source = source.replace(sourceMapReferenceLineRegExp, "");

		// FIXME: Embed sources directly in the source map, as there is no way to make Meteor serve them as files.
		sourceMapObject = JSON.parse(sourceMap);
		sourceMapObject.file = compileStep.pathForSourceMap;
		sourceMapObject.sourcesContent = [];
		sourceMapObject.sources.forEach(function(path) {
			var fullPath = inputPathToFullPathMap[path];
			var sourceContent = fs.readFileSync(fullPath, { encoding: "utf8" });
			sourceMapObject.sourcesContent.push(sourceContent);
		});
		sourceMap = JSON.stringify(sourceMapObject);

		compileStep.addJavaScript({
			path: compileStep.inputPath + ".js",
			sourcePath: compileStep.inputPath,
			data: source,
			sourceMap: sourceMap,
		});
	}

	fullInputPaths = [];
	inputPathToFullPathMap = {};
});
