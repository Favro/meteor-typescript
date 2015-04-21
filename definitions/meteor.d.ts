declare module Mongo {
	class ObjectID {
		constructor(hexString?: string);
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

	class Collection<T> {
		constructor(name: string);

		find(selector: any, options?: {
			sort?: SortSpecifier;
			skip?: number;
			limit?: number;
			fields?: FieldSpecifier;
			reactive?: boolean;
			transform?: (doc: T) => T;
		}): Cursor<T>;

		findOne(selector: any, options?: {
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

	interface Template {
		helpers(helpers: {
			[name: string]: (...args: any[]) => Object;
		}): void;

		events(eventMap: {
			[selector: string]: (event: Event) => void;
		}): void;

		onRendered(callback: () => void): void;
		onCreated(callback: () => void): void;
		onDestroyed(callback: () => void): void;
	}

	interface TemplateInstance {
		// FIXME.
	}

	interface User {
		_id: string;
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

	var users: Mongo.Collection<User>;
}

declare module Accounts {
	interface LoginAttempt {
		user: Meteor.User;
	}

	function validateLoginAttempt(func: (attempt: LoginAttempt) => any): void;
}

declare module Tracker {
	function autorun(func: () => void): void;
}

declare class ReactiveVar<T> {
	constructor(initialValue: T);
	get(): T;
	set(value: T): void;
}

declare module Template {
	function instance(): Meteor.TemplateInstance;

	var body: Meteor.Template;
}

declare function check(value: any, pattern: any): void;
