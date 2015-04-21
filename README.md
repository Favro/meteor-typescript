# TypeScript for Meteor

A Meteor package that enables use of TypeScript (`.ts` files).

* Meteor: https://www.meteor.com/
* TypeScript: http://www.typescriptlang.org/

## How to use

1. Add this package to your project.
2. Add `.ts` files or convert your existing `.js` files to `.ts`.
3. Add `.d.ts` files with definitions for the libraries you use (see `definitions` directory).
4. Add empty `main.ts-build` file at the top level. This is the file that triggers the actual compilation. All `.ts` files are passed to the compiler in one go, so that types are automatically visible across files, and to avoid Meteor file scoping that breaks TypeScript assumptions.

Mixing languages (both plain JavaScript and TypeScript) in one project is not supported because all source files are expected to be processed at once (see #4 above).
