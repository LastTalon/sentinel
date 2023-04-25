import { World } from "@rbxts/matter";
import { Model } from "shared/ecs/components";
import { getIdAttribute } from "shared/idAttribute";

/**
 * A system that updates the ID of {@link Model | Models}.
 *
 * @param world - The {@link World} the system operates on
 */
function updateIdAttribute(world: World): void {
	for (const [id, record] of world.queryChanged(Model)) {
		record.new?.model?.SetAttribute(getIdAttribute(), id);
	}
}

export = updateIdAttribute;
