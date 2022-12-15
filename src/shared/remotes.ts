const ERROR_MISSING = "%s '%s' was requested, but no such %s exists.";
const ERROR_MISSING_EVENT = ERROR_MISSING.format("Event", "%s", "remote event");
const ERROR_MISSING_FUNCTION = ERROR_MISSING.format("Function", "%s", "remote function");

const ERROR_INVALID = "%s '%s' was requested, but was not a %s.";
const ERROR_INVALID_EVENT = ERROR_INVALID.format("Event", "%s", "remote event");
const ERROR_INVALID_FUNCTION = ERROR_INVALID.format("Function", "%s", "remote function");

const events = new Map<string, RemoteEvent>();
const functions = new Map<string, RemoteFunction>();

/**
 * Gets a remote event by name. If the event doesn't exist it is created.
 *
 * @param name - The name of the event
 * @returns The remote event associated with the name
 */
export function getEvent(name: string): RemoteEvent {
	let event = events.get(name);
	if (!event) {
		const instance = script.FindFirstChild(name);
		if (instance && instance.IsA("RemoteEvent")) {
			event = instance;
		} else {
			event = new Instance("RemoteEvent");
			event.Name = name;
			event.Parent = script;
		}
		events.set(name, event);
	}
	return event;
}

/**
 * Gets a remote event by name.
 *
 * @param name - The name of the event
 * @returns The remote event associated with the name
 *
 * @throws "Event '[name]' was requested, but no such remote event exists."
 * @throws "Event '[name]' was requested, but was not a remote event."
 */
export function getEventOrFail(name: string): RemoteEvent {
	let event = events.get(name);
	if (!event) {
		const instance = script.FindFirstChild(name);
		if (!instance) {
			throw ERROR_MISSING_EVENT.format(name);
		}
		if (!instance.IsA("RemoteEvent")) {
			throw ERROR_INVALID_EVENT.format(name);
		}
		event = instance;
		events.set(name, event);
	}
	return event;
}

/**
 * Gets a remote event by name, waiting for it if it doesn't exist.
 *
 * @param name - The name of the event
 * @param timeout - The time to wait for the event
 * @returns The remote event associated with the name
 *
 * @throws "Event '[name]' was requested, but was not a remote event."
 */
export function waitForEvent(name: string): RemoteEvent;
export function waitForEvent(name: string, timeout: number): RemoteEvent | undefined;
export function waitForEvent(name: string, timeout?: number): RemoteEvent | undefined {
	let event = events.get(name);
	if (!event) {
		const instance =
			timeout !== undefined ? script.WaitForChild(name, timeout) : script.WaitForChild(name);
		if (!instance) return;
		if (!instance.IsA("RemoteEvent")) {
			throw ERROR_INVALID_EVENT.format(name);
		}
		event = instance;
		events.set(name, event);
	}
	return event;
}

/**
 * Destroys the event associated with a name.
 *
 * @param name - The name of the event
 */
export function destroyEvent(name: string): void {
	const event = events.get(name);
	if (event) {
		event.Destroy();
		events.delete(name);
	}
}

/**
 * Gets a remote function by name. If the function doesn't exist it is created.
 *
 * @param name - The name of the function
 * @returns The remote function associated with the name
 */
export function getFunction(name: string): RemoteFunction {
	let fn = functions.get(name);
	if (!fn) {
		const instance = script.FindFirstChild(name);
		if (instance && instance.IsA("RemoteFunction")) {
			fn = instance;
		} else {
			fn = new Instance("RemoteFunction");
			fn.Name = name;
			fn.Parent = script;
		}
		functions.set(name, fn);
	}
	return fn;
}

/**
 * Gets a remote function by name.
 *
 * @param name - The name of the function
 * @returns The remote function associated with the name
 *
 * @throws "Function '[name]' was requested, but no such remote function exists."
 * @throws "Function '[name]' was requested, but was not a remote function."
 */
export function getFunctionOrFail(name: string): RemoteFunction {
	let fn = functions.get(name);
	if (!fn) {
		const instance = script.FindFirstChild(name);
		if (!instance) {
			throw ERROR_MISSING_FUNCTION.format(name);
		}
		if (!instance.IsA("RemoteFunction")) {
			throw ERROR_INVALID_FUNCTION.format(name);
		}
		fn = instance;
		functions.set(name, fn);
	}
	return fn;
}

/**
 * Gets a remote function by name, waiting for it if it doesn't exist.
 *
 * @param name - The name of the function
 * @param timeout - The time to wait for the function
 * @returns The remote function associated with the name
 *
 * @throws "Function '[name]' was requested, but was not a remote function."
 */
export function waitForFunction(name: string): RemoteFunction;
export function waitForFunction(name: string, timeout: number): RemoteFunction | undefined;
export function waitForFunction(name: string, timeout?: number): RemoteFunction | undefined {
	let fn = functions.get(name);
	if (!fn) {
		const instance =
			timeout !== undefined ? script.WaitForChild(name, timeout) : script.WaitForChild(name);
		if (!instance) return;
		if (!instance.IsA("RemoteFunction")) {
			throw ERROR_INVALID_FUNCTION.format(name);
		}
		fn = instance;
		functions.set(name, fn);
	}
	return fn;
}

/**
 * Destroys the function associated with a name.
 *
 * @param name - The name of the function
 */
export function destroyFunction(name: string): void {
	const fn = functions.get(name);
	if (fn) {
		fn.Destroy();
		functions.delete(name);
	}
}
