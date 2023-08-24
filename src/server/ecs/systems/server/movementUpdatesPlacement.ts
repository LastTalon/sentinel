import { World } from "@rbxts/matter";
import { GamePlacement, Movement } from "shared/ecs/components";

function movementUpdatesPlacement(world: World): void {
	for (const [id, record] of world.queryChanged(Movement)) {
		if (!record.new) continue;

		const currentSpeed = record.new.velocity.Magnitude;
		let expectedVelocity;
		if (currentSpeed === 0) {
			expectedVelocity = Vector2.zero;
		} else {
			const adjustedSpeed = math.min(currentSpeed, record.new.maxSpeed);
			const speedReductionRatio = adjustedSpeed / currentSpeed;

			expectedVelocity = record.new.velocity.mul(speedReductionRatio);
		}

		const expectedAngularVelocity = math.clamp(
			record.new.angularVelocity,
			-record.new.maxAngularSpeed,
			record.new.maxAngularSpeed,
		);

		if (
			expectedVelocity === record.new.velocity &&
			expectedAngularVelocity === record.new.angularVelocity
		)
			continue;

		world.insert(
			id,
			record.new.patch({
				velocity: expectedVelocity,
				angularVelocity: expectedAngularVelocity,
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
