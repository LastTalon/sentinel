import { useEvent, World } from "@rbxts/matter";
import { Model } from "shared/components";

/**
 * A system that removes missing {@link Model | Models}.
 *
 * If a model is removed from the game, this system will remove the
 * corresponding model from the world.
 *
 * If a model is removed from the world, this system will remove the
 * corresponding model from the game.
 *
 * @param world - The {@link World} the system operates on
 */
function removeMissingModels(world: World): void {
	for (const [id, model] of world.query(Model)) {
		if (!model.model) continue;
		for (const _ of useEvent(model.model, "AncestryChanged")) {
			if (!model.model.IsDescendantOf(game)) {
				world.remove(id, Model);
				break;
			}
		}
	}

	for (const [_, record] of world.queryChanged(Model)) {
		if (record.new) continue;
		record.old?.model?.Destroy();
	}
}

export = removeMissingModels;
