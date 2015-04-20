var typescript = Npm.require("typescript");

var fullInputPaths = [];

Plugin.registerSourceHandler("ts", function(compileStep) {
	fullInputPaths.push(compileStep.fullInputPath);
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
		compileStep.addJavaScript({
			path: compileStep.inputPath + ".js",
			sourcePath: compileStep.inputPath,
			data: source,
			sourceMap: sourceMap,
		});
	}

	fullInputPaths = [];
});
