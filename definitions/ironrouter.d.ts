declare module Router {
	interface Config {
		layoutTemplate?: string;
		notFoundTemplate?: string;
		loadingTemplate?: string;

		waitOn?: () => Meteor.SubscriptionHandle[];
	}

	interface Route {
		name: string;
		path(): string;
	}

	interface Controller {
		route: Route;
		params: any;
		data: any;
	}

	type HookCallback = () => void;
	type Hook = HookCallback | string;
	type RouteCallback = () => void;

	interface RouteConfig {
		name?: string;
		path?: string;
		where?: string;
		action?: () => void;
		onBeforeAction?: Hook | Hook[];
		onStop?: () => void;
		template?: string;
	}

	interface HookOptions {
		only?: string[];
		except?: string[];
	}

	function configure(config: Config): void;
	function route(path: string, func: RouteCallback, config?: RouteConfig): void;
	function route(path: string, config: RouteConfig): void;
	function go(nameOrPath: string, params?: any, options?: any): void;
	function current(): Controller;
	function onBeforeAction(hook: Hook, options?: HookOptions): void;
	function plugin(plugin: string, options?: any): void;
}
