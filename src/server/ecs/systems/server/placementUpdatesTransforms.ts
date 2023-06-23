import { World } from "@rbxts/matter";
import { GamePlacement, Transform } from "shared/ecs/components";
import displaceHeight from "./displaceHeight";
import movementUpdatesPlacement from "./movementUpdatesPlacement";

const DEFAULT_HEIGHT = 0;
const GEOMETRY_HEIGHT = 0;

function placementUpdatesTransforms(world: World): void {
	for (const [id, placement] of world.query(GamePlacement, Transform)) {
		const heightOffset =
			DEFAULT_HEIGHT +
			placement.offsetHeight +
			(placement.respectsGeometry
				? GEOMETRY_HEIGHT // Should be something like state.geometry.height
				: 0);

		const worldPosition = new CFrame(placement.position.X, heightOffset, placement.position.Y);
		const worldOrientation = CFrame.fromOrientation(0, math.rad(placement.orientation), 0);

		world.insert(
			id,
			Transform({
				cframe: worldPosition.mul(worldOrientation),
			}),
		);
	}
}

export = {
	system: placementUpdatesTransforms,
	after: [movementUpdatesPlacement, displaceHeight],
};
