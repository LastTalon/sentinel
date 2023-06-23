import { World } from "@rbxts/matter";
import { GamePlacement, HipHeight, TravelHeight } from "shared/ecs/components";

function displaceHeight(world: World): void {
	for (const [id, record] of world.queryChanged(HipHeight)) {
		const placement = world.get(id, GamePlacement);
		if (!placement) continue;

		let height = 0;
		if (record.new) {
			height += record.new.height;
		}

		if (!world.contains(id)) continue;

		const travelHeight = world.get(id, TravelHeight);
		if (travelHeight) {
			height += travelHeight.height;
		}

		world.insert(
			id,
			placement.patch({
				offsetHeight: height,
			}),
		);
	}

	for (const [id, record] of world.queryChanged(TravelHeight)) {
		const placement = world.get(id, GamePlacement);
		if (!placement) continue;

		let height = 0;
		if (record.new) {
			height += record.new.height;
		}

		if (!world.contains(id)) continue;

		const hipHeight = world.get(id, HipHeight);
		if (hipHeight) {
			height += hipHeight.height;
		}

		world.insert(
			id,
			placement.patch({
				offsetHeight: height,
			}),
		);
	}
}

export = displaceHeight;
