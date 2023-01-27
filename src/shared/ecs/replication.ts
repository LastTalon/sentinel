import { AnyEntity, World } from "@rbxts/matter";
import * as Components from "shared/components";
import { waitForEvent } from "shared/remotes";
import { State } from "./state";

type ComponentNames = keyof typeof Components;
type ComponentConstructors = (typeof Components)[ComponentNames];
type Components = ReturnType<ComponentConstructors>;
type Archetypes = Parameters<ComponentConstructors>[0];

const DEBUG_SPAWN = "Spawn %ds%d with %s";
const DEBUG_DESPAWN = "Despawn %ds%d";
const DEBUG_MODIFY = "Modify %ds%d adding %s, removing %s";

let connection: RBXScriptConnection | undefined;

/**
 * Starts the replication receiver.
 *
 * @param world - The world to replicate components in
 * @param state - The global state for the ECS
 */
export function start(world: World, state: State): void {
	if (connection) return;

	function debugPrint(message: string, args: () => (string | number)[]): void {
		if (state.debugEnabled) {
			print("ECS Replication>", string.format(message, ...args()));
		}
	}

	const replicationEvent = waitForEvent("EcsReplication");
	const serverToClientEntity = new Map<string, AnyEntity>();

	connection = replicationEvent.OnClientEvent.Connect(
		(entities: Map<string, Map<ComponentNames, { data?: Archetypes }>>) => {
			for (const [serverId, componentMap] of entities) {
				const clientId = serverToClientEntity.get(serverId);

				if (clientId !== undefined && next(componentMap)[0] === undefined) {
					world.despawn(clientId);
					serverToClientEntity.delete(serverId);
					debugPrint(DEBUG_DESPAWN, () => [clientId, serverId]);
					continue;
				}

				const componentsToInsert: Components[] = [];
				const componentsToRemove: ComponentConstructors[] = [];
				const insertNames: ComponentNames[] = [];
				const removeNames: ComponentNames[] = [];

				for (const [name, container] of componentMap) {
					const component = Components[name];
					if (container.data) {
						componentsToInsert.push(
							// The type of component above is an intersection of all possible
							// component types since it can't know which specific component is
							// associated with the name. Therefore here, we must cast to an
							// intersection so that the data can be used.
							//
							// This is okay because the data must be associated with the name
							// it was created with, but the type checker can't verify this for
							// us. To solve this the type must somehow be associated with the
							// name in the type system. For now, this cast works fine.
							component(container.data as UnionToIntersection<Archetypes>),
						);
						insertNames.push(name);
					} else {
						componentsToRemove.push(component);
						removeNames.push(name);
					}
				}

				if (clientId === undefined) {
					const clientId = world.spawn(...componentsToInsert);
					serverToClientEntity.set(serverId, clientId);
					debugPrint(DEBUG_SPAWN, () => [clientId, serverId, insertNames.join(",")]);
				} else {
					if (componentsToInsert.size() > 0) {
						world.insert(clientId, ...componentsToInsert);
					}

					if (componentsToRemove.size() > 0) {
						world.remove(clientId, ...componentsToRemove);
					}

					debugPrint(DEBUG_MODIFY, () => [
						clientId,
						serverId,
						insertNames.size() > 0 ? insertNames.join(", ") : "nothing",
						removeNames.size() > 0 ? removeNames.join(", ") : "nothing",
					]);
				}
			}
		},
	);
}

/**
 * Stops receiving replication.
 */
export function stop(): void {
	if (!connection) return;
	connection.Disconnect();
	connection = undefined;
}
