declare module Iron {
	function controller(): any;
}

declare module Router {
	type HookCallback = () => void;
	export type Hook = HookCallback | string;
	type RouteCallback = () => void;

	interface Config {
		layoutTemplate?: string;
		notFoundTemplate?: string;
		loadingTemplate?: string;

		waitOn?: () => Meteor.SubscriptionHandle[];
	}

	interface Route {
		name: string;
		getName(): string;
		path(): string;

		get(func: RouteCallback): Route;
		post(func: RouteCallback): Route;
		put(func: RouteCallback): Route;
		delete(func: RouteCallback): Route;
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
		onRun?: Hook | Hook[];
		onRerun?: Hook | Hook[];
		onBeforeAction?: Hook | Hook[];
		onAfterAction?: Hook | Hook[];
		onStop?: Hook | Hook[];
		template?: string;
	}

	interface HookOptions {
		only?: string[];
		except?: string[];
	}

	function configure(config: Config): void;
	function route(path: string, func: RouteCallback, config?: RouteConfig): Route;
	function route(path: string, config?: RouteConfig): Route;
	function go(nameOrPath: string, params?: any, options?: any): void;
	function current(): Controller;
	function onRun(hook: Hook, options?: HookOptions): void;
	function onRerun(hook: Hook, options?: HookOptions): void;
	function onBeforeAction(hook: Hook, options?: HookOptions): void;
	function onAfterAction(hook: Hook, options?: HookOptions): void;
	function onStop(hook: Hook, options?: HookOptions): void;
	function plugin(plugin: string, options?: any): void;
}
