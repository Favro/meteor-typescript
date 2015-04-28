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

	interface Cursor<T> {
		count(): number;
		forEach(callback: (doc: T, index?: number, cursor?: Cursor<T>) => void, thisArg?: any): void;
		fetch(): T[];
	}

	var Collection: CollectionStatic;

	interface CollectionStatic {
		new<T>(name: string): Collection<T>;
	}

	interface Collection<T> {
		find(selector?: any, options?: {
			sort?: SortSpecifier;
			skip?: number;
			limit?: number;
			fields?: FieldSpecifier;
			reactive?: boolean;
			transform?: (doc: T) => T;
		}): Cursor<T>;

		findOne(selector?: any, options?: {
			sort?: SortSpecifier;
			skip?: number;
			fields?: FieldSpecifier;
			reactive?: boolean;
			transform?: (doc: T) => T;
		}): T;

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
	}
}

declare module Meteor {
	class Error {
		constructor(error: number, reason?: string, details?: string);
	}

	interface Event {
		type: string;
		target: HTMLElement;
		currentTarget: HTMLElement;
		which: number;
		stopPropagation(): void;
		stopImmediatePropagation(): void;
		preventDefault(): void;
		isPropagationStopped(): boolean;
		isImmediatePropagationStopped(): boolean;
		isDefaultPrevented(): boolean;
	}

	interface HelpersMap {
		[name: string]: any;
	}

	interface EventsMap {
		[selector: string]: (event?: Event, tpl?: TemplateInstance) => void;
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
		firstNode: HTMLElement;
		lastNode: HTMLElement;
		data: any;
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

	interface SubscriptionHandle {
		stop(): void;
		ready(): boolean;
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

	function validateLoginAttempt(func: (attempt: LoginAttempt) => any): void;
	function onLogin(func: (attempt: LoginAttempt) => void): void;
	function onCreateUser(func: (options: CreateUserOptions, user: Meteor.User) => Meteor.User): void;
	function onEmailVerificationLink(func: (token: string, done: Function) => void): void;
	function verifyEmail(token: string, callback?: (err?: any) => void): void;

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
	function autorun(func: () => void): void;
	function flush(): void;
	function afterFlush(func: () => void): void;
}

declare class ReactiveVar<T> {
	constructor(initialValue: T);
	get(): T;
	set(value: T): void;
}

declare module Template {
	function instance(): Meteor.TemplateInstance;
	function currentData(): any;
	function parentData(numLevels?: number): any;
	function registerHelper(name: string, func: Function): void;

	var body: Meteor.Template;
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

declare module Blaze {
	interface Template {}

	interface View {
		templateInstance(): Meteor.TemplateInstance;
	}

	function render(templateOrView: Template | View, parentNote: HTMLElement, nextNode?: HTMLElement, parentView?: View): void;
	function renderWithData(templateOrView: Template | View, data: any, parentNote: HTMLElement, nextNode?: HTMLElement, parentView?: View): void;
	function getData(elementOrView?: HTMLElement | View): any;
	function getView(element?: HTMLElement): View;
	function remove(renderedView: View): void;

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
