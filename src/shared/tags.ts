import { CollectionService } from "@rbxts/services";
import { AnyEntity, Component, World } from "@rbxts/matter";
import { getIdAttribute } from "shared/idAttribute";
import { Model, Transform } from "shared/components";

export type ComponentConstructor<T extends object> = () => Component<T>;

const connections: RBXScriptConnection[] = [];

export function start(
	world: World,
	bound: ReadonlyMap<string, ComponentConstructor<object>>,
): void {
	function spawnBound<T extends object>(
		instance: Instance,
		component: ComponentConstructor<T>,
	): void {
		let primaryPart: BasePart;
		if (instance.IsA("Model")) {
			if (instance.PrimaryPart) {
				primaryPart = instance.PrimaryPart;
			} else {
				warn("Attempted to tag a model that has no primary part:", instance);
				return;
			}
		} else if (instance.IsA("BasePart")) {
			primaryPart = instance;
		} else {
			warn("Attempted to tag an instance that is not a Model or BasePart:", instance);
			return;
		}

		const id = world.spawn(
			component(),
			Model({
				model: instance,
			}),
			Transform({
				cframe: primaryPart.CFrame,
			}),
		);
		instance.SetAttribute(getIdAttribute(), id);
	}

	for (const [tag, component] of bound) {
		for (const instance of CollectionService.GetTagged(tag)) {
			spawnBound(instance, component);
		}

		connections.push(
			CollectionService.GetInstanceAddedSignal(tag).Connect((instance: Instance): void => {
				spawnBound(instance, component);
			}),
		);

		connections.push(
			CollectionService.GetInstanceRemovedSignal(tag).Connect((instance: Instance): void => {
				const id = instance.GetAttribute(getIdAttribute());
				if (typeIs(id, "number")) {
					world.despawn(id as AnyEntity);
				}
			}),
		);
	}
}

export function stop(): void {
	for (const connection of connections) {
		connection.Disconnect();
	}
	connections.clear();
}
