var fs = Npm.require("fs");
var path = Npm.require("path");
var typescript = Npm.require("typescript");

var sourceMapReferenceLineRegExp = new RegExp("//# sourceMappingURL=.*$", "m");

function compile(input) {
	var result = {
		source: "",
		sourceMap: "",
		errors: [],
	};

	var options = {
		out: "out.js",
		target: 1,
		sourceMap: true,
		removeComments: true,
		noEmitOnError: true,
	};

	var compilerHost = typescript.createCompilerHost(options);
	compilerHost.writeFile = function(fileName, data, writeByteOrderMark, onError) {
		if (fileName == "out.js")
			result.source = data;
		else
			result.sourceMap = data;
	};

	var program = typescript.createProgram(input.fullPaths, options, compilerHost);
	var emitResult = program.emit();

	var allDiagnostics = typescript.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

	allDiagnostics.forEach(function(diagnostic) {
		var lineAndCharacter = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
		var line = lineAndCharacter.line + 1;
		var character = lineAndCharacter.character + 1;
		var diagnosticCategory = typescript.DiagnosticCategory[diagnostic.category];
		var message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

		result.errors.push({
			message: diagnosticCategory + " TS" + diagnostic.code + ": " + message,
			sourcePath: diagnostic.file.fileName,
			line: line,
			column: character
		});
	});

	if (!emitResult.emitSkipped) {
		// Remove source map reference line from generated js file.
		// Meteor sets up source map through HTTP response header instead.
		// FIXME: Should be an option for TypeScript compiler.
		result.source = result.source.replace(sourceMapReferenceLineRegExp, "");

		// FIXME: Embed sources directly in the source map, as there is no way to make Meteor serve them as files.
		sourceMapObject = JSON.parse(result.sourceMap);
		sourceMapObject.file = input.pathForSourceMap;
		sourceMapObject.sourcesContent = [];
		sourceMapObject.sources.forEach(function(sourcePath) {
			var fullPath = path.join(process.cwd(), sourcePath);
			var sourceContent = fs.readFileSync(fullPath, { encoding: "utf8" });
			sourceMapObject.sourcesContent.push(sourceContent);
		});
		result.sourceMap = JSON.stringify(sourceMapObject);
	}

	return result;
}

// Cache persists across plugin invocations.
this.cache = this.cache || {};

function cachedCompile(input) {
	var key = "";

	input.fullPaths && input.fullPaths.forEach(function(fullPath) {
		key += fullPath;
		key += ":";
		key += fs.statSync(fullPath).mtime.getTime();
		key += ":";
	});

	var archCache = cache[input.arch] || {};

	if (archCache.key !== key) {
		archCache.key = key;
		archCache.result = compile(input);
	}

	cache[input.arch] = archCache;
	return archCache.result;
}

var compileInput = {};

Plugin.registerSourceHandler("ts", function(compileStep) {
	compileInput.fullPaths = compileInput.fullPaths || [];
	compileInput.fullPaths.push(compileStep.fullInputPath);
});

Plugin.registerSourceHandler("ts-build", function(compileStep) {
	compileInput.arch = compileStep.arch;
	compileInput.pathForSourceMap = compileStep.pathForSourceMap;

	var result = cachedCompile(compileInput);

	result.errors.forEach(function(error) {
		compileStep.error(error);
	});

	if (result.source) {
		compileStep.addJavaScript({
			path: compileStep.inputPath + ".js",
			sourcePath: compileStep.inputPath,
			data: result.source,
			sourceMap: result.sourceMap,
		});
	}

	compileInput = {};
});
