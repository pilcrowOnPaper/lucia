export class LuciaError extends Error {
	constructor(errorMsg: ErrorMessage, detail?: string) {
		super(errorMsg);
		this.message = errorMsg;
		this.detail = detail ?? "";
	}
	public detail: string;
	public message: ErrorMessage;
}

type Constructor<C extends new (...args: any[]) => any> = new (
	...args: ConstructorParameters<C>
) => InstanceType<C>;

export type LuciaErrorConstructor = Constructor<typeof LuciaError>;

export type ErrorMessage =
	| "AUTH_INVALID_SESSION_ID"
	| "AUTH_INVALID_PASSWORD"
	| "AUTH_DUPLICATE_KEY_ID"
	| "AUTH_INVALID_KEY_ID"
	| "AUTH_INVALID_USER_ID"
	| "AUTH_INVALID_REQUEST"
	| "AUTH_NOT_AUTHENTICATED"
	| "AUTH_UNIQUE_CONSTRAINT_VIOLATION"
	| "REQUEST_UNAUTHORIZED"
	| "UNKNOWN_ERROR"
	| "AUTH_OUTDATED_PASSWORD";
