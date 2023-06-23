import { World } from "@rbxts/matter";
import { GamePlacement, Movement } from "shared/ecs/components";

function movementUpdatesPlacement(world: World): void {
	for (const [id, movement] of world.query(Movement)) {
		const currentSpeed = movement.velocity.Magnitude;
		const adjustedSpeed = math.min(currentSpeed, movement.maxSpeed);
		const speedReductionRatio = adjustedSpeed / currentSpeed;

		world.insert(
			id,
			movement.patch({
				velocity: movement.velocity.mul(speedReductionRatio),
				angularVelocity: math.clamp(
					movement.angularVelocity,
					-movement.maxAngularSpeed,
					movement.maxAngularSpeed,
				),
			}),
		);
	}

	for (const [id, movement, placement] of world.query(Movement, GamePlacement)) {
		world.insert(
			id,
			placement.patch({
				position: placement.position.add(movement.velocity),
				orientation: placement.orientation + movement.angularVelocity,
			}),
		);
	}
}

export = movementUpdatesPlacement;
