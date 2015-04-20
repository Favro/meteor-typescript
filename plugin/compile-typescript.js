var fs = Npm.require("fs");
var temp = Npm.require("temp");
var typescript = Npm.require("typescript");

var fullInputPaths = [];

Plugin.registerSourceHandler("ts", function(compileStep) {
	fullInputPaths.push(compileStep.fullInputPath);
});

Plugin.registerSourceHandler("ts-build", function(compileStep) {
	var outFilePath = temp.path({ suffix: ".js" });

	var options = {
		out: outFilePath,
		target: 1,
		sourceMap: true,
		removeComments: true,
		noEmitOnError: true,
	};

	var program = typescript.createProgram(fullInputPaths, options);
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
		var source = fs.readFileSync(outFilePath, { encoding: "utf8" }) || "";
		var sourceMap = fs.readFileSync(outFilePath + ".map", { encoding: "utf8" }) || "";

		compileStep.addJavaScript({
			path: compileStep.inputPath + ".js",
			sourcePath: compileStep.inputPath,
			data: source,
			sourceMap: sourceMap,
		});

		fs.unlinkSync(outFilePath);
		fs.unlinkSync(outFilePath + ".map");
	}

	fullInputPaths = [];
});
