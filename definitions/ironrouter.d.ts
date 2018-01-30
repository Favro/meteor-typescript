declare module Iron {
	function controller(): any;

	interface RouterStatic {
		bodyParser: any;
		hooks: any;
	}

	var Router: RouterStatic;

	type HookCallback = (this: RouteController) => void;
	export type RouteHook = HookCallback | string;
	export type RouteHooks = RouteHook | RouteHook[];
	type RouteCallback = (this: RouteController) => void;

	interface RouterOptions {
		layoutTemplate?: string;
		notFoundTemplate?: string;
		loadingTemplate?: string;

		waitOn?: () => DDP.SubscriptionHandle[];
	}

	interface Route {
		getName(): string;
		path(params?: any, options?: any): string;

		get(func: RouteCallback): Route;
		post(func: RouteCallback): Route;
		put(func: RouteCallback): Route;
		delete(func: RouteCallback): Route;
	}

	interface RouterGoOptions {
		replaceState?: boolean;
		query?: string | { [key: string]: string | number | boolean };
	}

	interface RouteController {
		stop(): void;
		next(): void;
		wait(handle: DDP.SubscriptionHandle);
		ready(): boolean;

		render(template: string, options?: {
			data?: any;
			to?: string
		});

		redirect(nameOrPath: string, params?: any, options?: RouterGoOptions);

		route: Route;
		params: {
			query: any;
			hash: string;
			[param: string]: string;
		};
		data: any;
		request: any;
		response: any;
		layout: any;

		_rendered: boolean;

		_layout: {
			_regions: {
				[name: string]: {
					_template: string;
				};
			};
		};
	}

	interface RouteOptions {
		name?: string;
		path?: string | RegExp;
		where?: string;
		action?: RouteCallback;
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

	interface RouteHookEntry {
		hook: RouteHook;
		options: RouteHookOptions;
	}

	interface Router {
		configure(options: RouterOptions): void;
		route(path: string, func: RouteCallback, options?: RouteOptions): Route;
		route(path: string, options?: RouteOptions): Route;
		go(nameOrPath: string, params?: any, options?: RouterGoOptions): void;
		current(): RouteController;
		onRun(hook: RouteHook, options?: RouteHookOptions): void;
		onRerun(hook: RouteHook, options?: RouteHookOptions): void;
		onBeforeAction(hook: RouteHook, options?: RouteHookOptions): void;
		onAfterAction(hook: RouteHook, options?: RouteHookOptions): void;
		onStop(hook: RouteHook, options?: RouteHookOptions): void;
		plugin(plugin: string, options?: any): void;
		configureBodyParsers(): void;
		url(routeName: string, params?: any, options?: RouterGoOptions): string;

		routes: {
			[name: string]: Route;
		};

		_globalHooks: {
			onRun: RouteHookEntry[];
		};
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
