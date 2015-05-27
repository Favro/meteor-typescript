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

	interface RouteConfig {
		name?: string;
		path?: string;
		where?: string;
		action?: () => void;
		onBeforeAction?: () => void;
		onStop?: () => void;
		template?: string;
	}

	interface HookOptions {
		only?: string[];
		except?: string[];
	}

	type HookCallback = () => void;
	type RouteCallback = () => void;

	function configure(config: Config): void;
	function route(path: string, config?: RouteConfig | RouteCallback): void;
	function go(nameOrPath: string, params?: any, options?: any): void;
	function current(): Controller;
	function onBeforeAction(hookFuncOrName: HookCallback | string, options?: HookOptions): void;
}
