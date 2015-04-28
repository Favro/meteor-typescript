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

	interface RouteConfig {
		name?: string;
		path?: string;
		where?: string;
		action?: () => void;
		onBeforeAction?: () => void;
		onStop?: () => void;
		template?: string;
	}

	type RouteCallback = () => void;

	function configure(config: Config): void;
	function route(path: string, config: RouteConfig | RouteCallback): void;
	function go(nameOrPath: string, params?: any, options?: any): void;
	function current(): Controller;
	function onBeforeAction(func: () => void): void;
}
