declare module Mongo {
	class ObjectID {
		constructor(hexString?: string);
		toHexString(): string;
	}

	interface SortSpecifier {
		[field: string]: number;
	}

	interface FieldSpecifier {
		[field: string]: number;
	}

	interface ObserveHandle {
		stop(): void;
	}

	interface FindOneOptions<T> {
		sort?: SortSpecifier;
		skip?: number;
		fields?: FieldSpecifier;
		reactive?: boolean;
		transform?: (doc: T) => T;
	}

	interface FindOptions<T> extends FindOneOptions<T> {
		limit?: number;
	}

	interface Cursor<T> {
		count(): number;
		forEach(callback: (doc: T, index?: number, cursor?: Cursor<T>) => void, thisArg?: any): void;
		map(callback: (doc: T, index?: number, cursor?: Cursor<T>) => any, thisArg?: any): any[];
		fetch(): T[];

		observe(callbacks: {
			added?(document?: T): void;
			addedAt?(document?: T, atIndex?: number, before?: any): void;
			changed?(newDocument?: T, oldDocument?: T): void;
			changedAt?(newDocument?: T, oldDocument?: T, atIndex?: number): void;
			removed?(oldDocument?: T): void;
			removedAt?(oldDocument?: T, atIndex?: number): void;
			movedTo?(document?: T, fromIndex?: number, toIndex?: number, before?: any): void;
		}): ObserveHandle;

		observeChanges(callbacks: {
			added?(id?: any, fields?: any): void;
			addedBefore?(id?: any, fields?: any, before?: any): void;
			changed?(id?: any, fields?: any): void;
			movedBefore?(id?: any, before?: any): void;
			removed?(id?: any): void;
		}): ObserveHandle;
	}

	var Collection: CollectionStatic;

	interface CollectionStatic {
		new<T>(name: string): Collection<T>;
	}

	interface Collection<T> {
		find(selector?: any, options?: FindOptions<T>): Cursor<T>;
		findOne(selector?: any, options?: FindOneOptions<T>): T;

		insert(doc: T, callback?: (err?: any, id?: any) => void): any;

		update(selector: any, modifier: any, options?: {
			multi?: boolean;
			upsert?: boolean;
		}, callback?: (err?: any, numAffected?: number) => void): number;

		upsert(selector: any, modifier: any, options?: {
			multi?: boolean;
			upsert?: boolean;
		}, callback?: (err?: any, numAffected?: number) => void): {
			numberAffected: number;
			insertedId: any;
		};

		remove(selector: any): number;
		remove(selector: any, callback: (err?: any, numAffected?: number) => void): void;

		_makeNewID(): string;
	}
}

declare module Meteor {
	var Error: ErrorStatic;

	interface ErrorStatic {
		new(error: number, reason?: string, details?: string): Error;
	}

	interface Error {
		error: number;
		reason?: string;
		details?: string;
		message: string;
	}

	interface UserEmail {
		address: string;
		verified: boolean;
	}

	interface UserProfile {
		name: string;
	}

	interface UserServices {
		google: {
			email: string;
			verified_email: boolean;
			picture: string;
		};
	}

	interface User {
		_id?: string;
		createdAt?: Date;
		emails?: UserEmail[];
		profile?: UserProfile;
		services?: UserServices;
	}

	interface Subscription {
		added(collection: string, id: string, fields: any): void;
		changed(collection: string, id: string, fields: any): void;
		removed(collection: string, id: string): void;
		ready(): void;
		onStop(func: () => void): void;
		error(error: any): void;
		stop(): void;

		userId: string;
		connection: any;
	}

	interface SubscriptionHandle {
		stop(): void;
		ready(): boolean;
	}

	interface MethodInvocation {
		setUserId(userId: string): void;
		unblock(): void;

		userId: string;
		isSimulation: boolean;
		connection: any;
	}

	function methods(methods: Object): void;
	function publish(name: string, func: Function): void;
	function call(name: string, ...args: any[]): any;
	function subscribe(name: string, ...args: any[]): SubscriptionHandle;

	function user(): User;
	function userId(): string;
	function loggingIn(): boolean;
	function logout(callback?: (err?: any) => void): void;

	function startup(func: () => void): void;
	function wrapAsync(func: Function, context?: any): Function;

	function setTimeout(func: () => void, delay: number): number;
	function setInterval(func: () => void, delay: number): number;
	function clearTimeout(id: number): void;
	function clearInterval(id: number): void;
	function defer(func: () => void): void;

	function absoluteUrl(path?: string, options?: {
		secure?: boolean;
		replaceLocalhost?: boolean;
		rootUrl?: string;
	}): string;

	function _debug(...args: any[]): void;

	interface LoginOptions {
		requestPermissions?: string[];
		requestOfflineToken?: boolean;
		forceApprovalPrompt?: boolean;
		userEmail?: string;
		loginStyle?: string;
	}

	function loginWithGoogle(options?: LoginOptions, callback?: (err?: any) => void): void;
	function loginWithPassword(user: Object | string, password: string, callback?: (err?: any) => void): void;

	function status(): {
		connected: boolean;
		status: string;
		retryCount: number;
		retryTime?: number;
		reason?: string;
	};

	var users: Mongo.Collection<User>;

	var isClient: boolean;
	var isServer: boolean;
	var isCordova: boolean;
	var isSimulation: boolean;

	var settings: any;
	var release: string;
}

declare module EJSON {
	function parse(str: string): any;
	function stringify(val: any, options: {
		indent?: boolean | number | string;
		canonical?: boolean;
	}): string;
	function fromJSONValue(val: any): any;
	function toJSONValue(val: any): any;
	function equals(a: any, b: any, options: {
		keyOrderSensitive?: boolean;
	}): boolean;
	function clone(val: any): any;
	function newBinary(): any;
	function isBinary(x: any): boolean;
	function addType(name: string, factory: Function): void;
}

declare module Assets {
	function getText(assetPath: string): string;
}

declare module Session {
	function set(key: string, value: any): void;
	function setDefault(key: string, value: any): void;
	function get(key: string): any;
	function equals(key: string, value: any): boolean;
}

declare module Accounts {
	interface EmailCallbacks {
		from?: () => string;
		subject?: (user: Meteor.User) => string;
		text?: (user: Meteor.User, url: string) => string;
		html?: (user: Meteor.User, url: string) => string;
	}

	interface EmailTemplates {
		from?: string;
		siteName?: string;
		headers?: any;
		resetPassword?: EmailCallbacks;
		enrollAccount?: EmailCallbacks;
		verifyEmail?: EmailCallbacks;
	}

	interface URLs {
		verifyEmail?: (token: string) => string;
		resetPassword?: (token: string) => string;
	}

	type EmailDomainCallback = (email: string) => boolean;

	interface LoginAttempt {
		type: string;
		allowed: boolean;
		error: any;
		user: Meteor.User;
		connection: any;
		methodName: string;
		methodArguments: any[];
	}

	interface CreateUserOptions {
		username?: string;
		email?: string;
		password: string;
		profile?: Meteor.UserProfile;
	}

	interface LoginHandlerResult {
		type?: string;
		userId?: string;
		error?: any;
	}

	type LoginHandler = (request: any) => LoginHandlerResult;

	interface LoginMethodOptions {
		methodName?: string;
		methodArguments: any[];
		validateResult?: (result: any) => void;
		userCallback?: (error?: any) => void;
	}

	function validateLoginAttempt(func: (attempt: LoginAttempt) => any): void;
	function onLogin(func: (attempt: LoginAttempt) => void): void;
	function onCreateUser(func: (options: CreateUserOptions, user: Meteor.User) => Meteor.User): void;
	function onEmailVerificationLink(func: (token: string, done: Function) => void): void;
	function verifyEmail(token: string, callback?: (err?: any) => void): void;

	function changePassword(oldPassword: string, newPassword: string, callback?: (err?: any) => void): void;

	function forgotPassword(options: {
		email?: string;
	}, callback?: (err?: any) => void): void;

	function resetPassword(token: string, newPassword: string, callback?: (err?: any) => void): void;

	function config(options: {
		sendVerificationEmail?: boolean;
		forbidClientAccountCreation?: boolean;
		restrictCreationByEmailDomain?: string | EmailDomainCallback;
		loginExpirationInDays?: number;
		oauthSecretKey?: string;
	}): void;

	function createUser(options: CreateUserOptions, callback?: (err?: any) => void): void;

	function loginServicesConfigured(): boolean;

	function registerLoginHandler(handler: LoginHandler): void;
	function registerLoginHandler(name: string, handler: LoginHandler): void;

	function callLoginMethod(options: LoginMethodOptions): void;

	var emailTemplates: EmailTemplates;
	var urls: URLs;
}

declare module Email {
	interface Options {
		from: string;
		to?: string | string[];
		cc?: string | string[];
		bcc?: string | string[];
		replyTo?: string | string[];
		subject?: string;
		text?: string;
		html?: string;
		headers?: any;
	}

	function send(options: Options): void;
}

declare module DDP {
	interface RandomStream {
		hexString(numChars: number): string;
	}

	function randomStream(): RandomStream;
}

declare module Tracker {
	interface Computation {
		stop(): void;
		invalidate(): void;
		onInvalidate(callback: (computation?: Computation) => void): void;

		stopped: boolean;
		invalidated: boolean;
		firstRun: boolean;
	}

	class Dependency {
		constructor();
		changed(): void;
		depend(fromComputation?: Computation): boolean;
		hasDependents(): boolean;
	}

	function autorun(func: (computation?: Computation) => void): Computation;
	function flush(): void;
	function afterFlush(func: () => void): void;
	function nonreactive<T>(func: (...args: any[]) => T): T;
	function onInvalidate(callback: (computation?: Computation) => void): void;

	var active: boolean;
	var currentComputation: Computation;
}

declare class ReactiveVar<T> {
	constructor(initialValue: T);
	get(): T;
	set(value: T): void;
}

declare module Template {
	function instance(): Blaze.TemplateInstance;
	function currentData(): any;
	function parentData(numLevels?: number): any;
	function registerHelper(name: string, func: Function): void;

	var body: Blaze.Template;
}

declare module Match {
	var Any: any;
	var Integer: any;
	function ObjectIncluding(fields: any): any;
	function Optional(pattern: any): any;
	function OneOf(...patterns: any[]): any;
	function Where(condition: Function): any;
}

declare function check(value: any, pattern: any): void;

declare module Npm {
	function require(name: string): any;
}

declare module ServiceConfiguration {
	var configurations: Mongo.Collection<any>;
}

interface JQuery {}
interface JQueryEventObject {}

declare module Blaze {
	interface HelpersMap {
		[name: string]: any;
	}

	interface EventsMap {
		[selector: string]: (event?: JQueryEventObject, tpl?: TemplateInstance) => void;
	}

	interface Template {
		helpers(helpers: HelpersMap): void;
		events(eventMap: EventsMap): void;

		onRendered(callback: () => void): void;
		onCreated(callback: () => void): void;
		onDestroyed(callback: () => void): void;

		rendered: () => void;
		created: () => void;
		destroyed: () => void;
	}

	interface TemplateInstance {
		$(selector: string): JQuery;
		find(selector: string): HTMLElement;
		findAll(selector: string): HTMLElement[];
		autorun(func: (computation?: Tracker.Computation) => void): void;
		subscribe(name: string, ...args: any[]): Meteor.SubscriptionHandle;

		view: View;
		firstNode: HTMLElement;
		lastNode: HTMLElement;
		data: any;
	}

	interface View {
		templateInstance(): TemplateInstance;
		autorun(func: (computation?: Tracker.Computation) => void): void;
		onViewCreated(func: () => void): void;
		onViewReady(func: () => void): void;
		onViewDestroyed(func: () => void): void;
		firstNode(): HTMLElement;
		lastNode(): HTMLElement;

		name: string;
		parentView: View;
		isCreated: boolean;
		isRendered: boolean;
		isDestroyed: boolean;
		renderCount: number;
		template: Template;
	}

	function render(templateOrView: Template | View, parentNote: HTMLElement, nextNode?: HTMLElement, parentView?: View): View;
	function renderWithData(templateOrView: Template | View, data: any, parentNote: HTMLElement, nextNode?: HTMLElement, parentView?: View): View;
	function toHTML(templateOrView: Template | View): string;
	function toHTMLWithData(templateOrView: Template | View, data: any): string;
	function getData(elementOrView?: HTMLElement | View): any;
	function getView(element?: HTMLElement): View;
	function remove(renderedView: View): void;
	function isTemplate(value: any): boolean;

	var currentView: View;
}

declare module Random {
	function id(n?: number): string;
	function secret(n?: number): string;
	function fraction(): number;
	function choice<T>(arrayOrString: Array<T>): T;
	function choice(arrayOrString: string): string;
	function hexString(n: number): string;
}

declare module LaunchScreen {
	interface HoldHandle {
		release(): void;
	}

	function hold(): HoldHandle;
}

declare module HTTP {
	interface Options {
		content?: string;
		data?: any;
		query?: string;
		params?: any;
		auth?: string;
		headers?: any;
		timeout?: number;
		followRedirects?: boolean;
		npmRequestOptions?: any;
	}

	interface Result {
		statusCode: number;
		content: string;
		data: any;
		headers: any;
	}

	type Callback = (error: any, result: Result) => void;

	function call(method: string, url: string, options?: Options): Result;
	function call(method: string, url: string, options: Options, asyncCallback: Callback): void;
	function get(url: string, options?: Options): Result;
	function get(url: string, options: Options, asyncCallback: Callback): void;
	function post(url: string, options?: Options): Result;
	function post(url: string, options: Options, asyncCallback: Callback): void;
	function put(url: string, options?: Options): Result;
	function put(url: string, options: Options, asyncCallback: Callback): void;
	function del(url: string, options?: Options): Result;
	function del(url: string, options: Options, asyncCallback: Callback): void;
}

declare module Base64 {
	function encode(array: Uint8Array | string): string;
	function decode(str: string): Uint8Array;
}
