import { World } from "@rbxts/matter";
import { GamePlacement, HipHeight, TravelHeight } from "shared/ecs/components";

function displaceHeight(world: World): void {
	const visited: Set<number> = new Set();

	for (const [id, record] of world.queryChanged(GamePlacement)) {
		if (!record.new) continue;

		let height = 0;
		visited.add(id);

		const hipHeight = world.get(id, HipHeight);
		if (hipHeight) {
			height += hipHeight.height;
		}

		const travelHeight = world.get(id, TravelHeight);
		if (travelHeight) {
			height += travelHeight.height;
		}

		if (height === record.new.offsetHeight) continue;

		world.insert(
			id,
			record.new.patch({
				offsetHeight: height,
			}),
		);
	}

	for (const [id, record] of world.queryChanged(HipHeight)) {
		if (visited.has(id)) continue;

		const placement = world.get(id, GamePlacement);
		if (!placement) continue;

		let height = 0;
		visited.add(id);
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
		if (visited.has(id)) continue;

		const placement = world.get(id, GamePlacement);
		if (!placement) continue;

		let height = 0;
		visited.add(id);
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
