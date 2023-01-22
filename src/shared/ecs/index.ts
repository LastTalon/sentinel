import { Players, ReplicatedStorage, RunService, UserInputService } from "@rbxts/services";
import { AnyEntity, Debugger, Loop, World } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";

import { Model } from "shared/components";
import { Host } from "shared/hosts";
import { start as startSystems, stop as stopSystems } from "shared/systems";
import { start as startTags, stop as stopTags } from "./tags";
import { start as startReplication, stop as stopReplication } from "./replication";
import { State } from "./state";
import { tags } from "./boundTags";

const MAX_DISPLAY_ORDER = 2147483647;
const GROUP_ID = 2880401;
const DEBUG_RANK = 253;

function authorize(player: Player): boolean {
	return player.GetRankInGroup(GROUP_ID) >= DEBUG_RANK;
}

let connections:
	| {
			[index: string]: RBXScriptConnection;
	  }
	| undefined;

export function start(host: Host): [World, State] {
	if (connections) throw "ECS already running.";

	const state: State = new State();
	// state.store = store ? new StoreProvider(store) : undefined;
	const world = new World();
	const debug = new Debugger(Plasma);
	debug.authorize = authorize;

	debug.findInstanceFromEntity = (id: AnyEntity): Instance | undefined => {
		if (!world.contains(id)) return;
		const model = world.get(id, Model);
		return model?.model;
	};

	const loop = new Loop(world, state, debug.getWidgets());
	startSystems(host, loop, debug);
	debug.autoInitialize(loop);

	connections = loop.begin({
		default: RunService.Heartbeat,
		Stepped: RunService.Stepped,
	});

	if (host === Host.All || host === Host.Server) {
		startTags(world, tags);
	}

	if (host === Host.All || host === Host.Client) {
		startReplication(world, state);

		const serverDebugger = ReplicatedStorage.FindFirstChild("MatterDebugger");
		if (serverDebugger && serverDebugger.IsA("ScreenGui")) {
			serverDebugger.DisplayOrder = MAX_DISPLAY_ORDER;
		}

		const clientDebugger = Players.LocalPlayer.FindFirstChild("MatterDebugger");
		if (clientDebugger && clientDebugger.IsA("ScreenGui")) {
			clientDebugger.DisplayOrder = MAX_DISPLAY_ORDER;
		}

		UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.F4 && authorize(Players.LocalPlayer)) {
				debug.toggle();
				state.debugEnabled = debug.enabled;
			}
		});
	}

	return [world, state];
}

export function stop(): void {
	if (!connections) return;
	for (const [_, connection] of pairs(connections)) {
		connection.Disconnect();
	}
	connections = undefined;
	stopTags();
	stopReplication();
	stopSystems();
}
