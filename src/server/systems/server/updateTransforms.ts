import { World } from "@rbxts/matter";
import { Workspace } from "@rbxts/services";
import { Model, Transform } from "shared/components";
import removeMissingModels from "./removeMissingModels";

function updateTransforms(world: World): void {
	for (const [id, record] of world.queryChanged(Transform)) {
		if (!world.contains(id)) continue;
		const model = world.get(id, Model);
		if (!model || !record.new || record.new._doNotReconcile) continue;
		model.model?.PivotTo(record.new.cframe);
	}

	for (const [id, record] of world.queryChanged(Model)) {
		if (!world.contains(id)) continue;
		const transform = world.get(id, Transform);
		if (!transform) continue;
		record.new?.model?.PivotTo(transform.cframe);
	}

	for (const [id, model, transform] of world.query(Model, Transform)) {
		if (!model.model) continue;

		let primaryPart: BasePart;
		if (model.model.IsA("Model")) {
			if (!model.model.PrimaryPart) continue;
			primaryPart = model.model.PrimaryPart;
		} else if (model.model.IsA("BasePart")) {
			primaryPart = model.model;
		} else {
			continue;
		}

		if (primaryPart.Anchored) continue;

		if (transform.cframe.Y < Workspace.FallenPartsDestroyHeight) {
			world.despawn(id);
			continue;
		}

		if (transform.cframe !== primaryPart.CFrame) {
			world.insert(
				id,
				Transform({
					cframe: primaryPart.CFrame,
					_doNotReconcile: true,
				}),
			);
		}
	}
}

/**
 * A system that updates {@link Transform | Transforms}.
 *
 * If a Transform is updated, the corresponding {@link Model} is updated to
 * match the Transform.
 *
 * If a Model is updated, the new referenced instance is updated to match the
 * Transform.
 *
 * If an non-anchored model moves, the Transform is updated to match the updated
 * instance transform.
 *
 * This system runs after {@link removeMissingModels} to ensure updates aren't
 * performed unnecessarily.
 */
export = {
	system: updateTransforms,
	after: [removeMissingModels],
};
