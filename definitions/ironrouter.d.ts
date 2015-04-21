declare module Router {
	interface Config {
		layoutTemplate?: string;
	}

	interface Route {
		path(): string;
	}

	interface Controller {
		route: Route;
	}

	function configure(config: Config): void;
	function route(path: string, func: () => void): void;
	function go(path: string): void;
	function current(): Controller;
}
