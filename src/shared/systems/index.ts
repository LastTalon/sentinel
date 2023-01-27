import { ServerScriptService } from "@rbxts/services";
import { AnySystem, Debugger, Loop } from "@rbxts/matter";
import { Context, HotReloader } from "@rbxts/rewire";
import { Host } from "shared/hosts";

const ERROR_CONTAINER = "%s container not found";

const shared = script.FindFirstChild("shared");
const client = script.FindFirstChild("client");
const server = ServerScriptService.FindFirstChild("sentinel")
	?.FindFirstChild("systems")
	?.FindFirstChild("server");

let firstRunSystems: AnySystem[] | undefined = [];
let hotReloader: HotReloader | undefined;

/**
 * Starts the system loader.
 *
 * Loads systems for the specified container into the provided loop and
 * debugger. Systems are hot reloaded as they are changed.
 *
 * @param container - The container to load
 * @param loop - The ECS loop to load systems into
 * @param debug - The debugger to load systems into
 *
 * @throws "[container] container not found"
 * This is thrown when a container necessary for the provided host doesn't
 * exist.
 */
export function start<T extends unknown[]>(container: Host, loop: Loop<T>, debug: Debugger): void {
	if (!firstRunSystems) return;

	const containers: Instance[] = [];
	if (!shared) throw string.format(ERROR_CONTAINER, "Shared");
	containers.push(shared);

	if (container === Host.All || container === Host.Client) {
		if (!client) throw string.format(ERROR_CONTAINER, "Client");
		containers.push(client);
	}
	if (container === Host.All || container === Host.Server) {
		if (!server) throw string.format(ERROR_CONTAINER, "Server");
		containers.push(server);
	}

	const systemsByModule: Map<ModuleScript, AnySystem> = new Map();

	function load(module: ModuleScript, context: Context): void {
		if (
			module.Name.match("%.spec$")[0] !== undefined ||
			module.Name.match("%.dev$")[0] !== undefined
		)
			return;
		const original = context.originalModule;
		const previous = systemsByModule.get(original);
		const [ok, required] = pcall(require, module);

		if (!ok) {
			warn("Error when hot-reloading system", module.Name, required);
			return;
		}

		// Here we don't know that this is necessarily a system, but we let matter
		// handle this at runtime.
		const system = required as AnySystem;

		if (firstRunSystems) {
			firstRunSystems.push(system);
		} else if (previous) {
			loop.replaceSystem(previous, system);
			debug.replaceSystem(previous, system);
		} else {
			loop.scheduleSystem(system);
		}

		systemsByModule.set(original, system);
	}

	function unload(_: ModuleScript, context: Context): void {
		if (context.isReloading) return;

		const original = context.originalModule;
		const previous = systemsByModule.get(original);
		if (previous) {
			loop.evictSystem(previous);
			systemsByModule.delete(original);
		}
	}

	hotReloader = new HotReloader();
	for (const container of containers) {
		hotReloader.scan(container, load, unload);
	}

	loop.scheduleSystems(firstRunSystems);
	firstRunSystems = undefined;
}

/**
 * Stops loading systems.
 */
export function stop(): void {
	if (firstRunSystems) return;
	firstRunSystems = [];
	hotReloader?.destroy();
}
