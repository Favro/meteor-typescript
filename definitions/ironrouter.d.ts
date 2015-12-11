declare module Iron {
	function controller(): any;

	interface RouterStatic {
		bodyParser: any;
		hooks: any;
	}

	var Router: RouterStatic;

	type HookCallback = () => void;
	export type RouteHook = HookCallback | string;
	export type RouteHooks = RouteHook | RouteHook[];
	type RouteCallback = () => void;

	interface RouterOptions {
		layoutTemplate?: string;
		notFoundTemplate?: string;
		loadingTemplate?: string;

		waitOn?: () => DDP.SubscriptionHandle[];
	}

	interface Route {
		getName(): string;
		path(): string;

		get(func: RouteCallback): Route;
		post(func: RouteCallback): Route;
		put(func: RouteCallback): Route;
		delete(func: RouteCallback): Route;
	}

	interface RouteController {
		route: Route;
		params: any;
		data: any;

		_rendered: boolean;

		next(): void;
		wait(handle: DDP.SubscriptionHandle);
		ready(): boolean;

		render(template: string, options?: {
			data?: any;
		});

		redirect(nameOrPath: string, params?: any, options?: {
			replaceState?: boolean;
		});
	}

	interface RouteOptions {
		name?: string;
		path?: string | RegExp;
		where?: string;
		action?: () => void;
		onRun?: RouteHooks;
		onRerun?: RouteHooks;
		onBeforeAction?: RouteHooks;
		onAfterAction?: RouteHooks;
		onStop?: RouteHooks;
		template?: string;
	}

	interface RouteHookOptions {
		only?: string[];
		except?: string[];
	}

	interface Router {
		configure(options: RouterOptions): void;
		route(path: string, func: RouteCallback, options?: RouteOptions): Route;
		route(path: string, options?: RouteOptions): Route;
		go(nameOrPath: string, params?: any, options?: any): void;
		current(): RouteController;
		onRun(hook: RouteHook, options?: RouteHookOptions): void;
		onRerun(hook: RouteHook, options?: RouteHookOptions): void;
		onBeforeAction(hook: RouteHook, options?: RouteHookOptions): void;
		onAfterAction(hook: RouteHook, options?: RouteHookOptions): void;
		onStop(hook: RouteHook, options?: RouteHookOptions): void;
		plugin(plugin: string, options?: any): void;
		configureBodyParsers(): void;
	}
}

declare var Router: Iron.Router;

declare module Iron.Url {
	interface UrlQueryObject {
		[s: string]: string;
	}

	interface UrlObject {
		rootUrl: string;
		originalUrl: string;
		href: string;
		protocol: string;
		auth: string;
		host: string;
		hostname: string;
		port: string;
		origin: string;
		path: string;
		pathname: string;
		search: string;
		query: string;
		queryObject: UrlQueryObject;
		hash: string;
		slashes: boolean;
	}

	function parse(url: string): UrlObject;
}
