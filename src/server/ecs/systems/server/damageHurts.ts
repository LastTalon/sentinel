import { World } from "@rbxts/matter";
import { Damage, Health } from "shared/ecs/components";

/**
 * A system that reduces health when Damage components are applied.
 *
 * This only adjusts any attached Health component.
 */
function damageHurts(world: World): void {
	for (const [id, health, damage] of world.query(Health, Damage)) {
		world.insert(
			id,
			health.patch({
				health: health.health - damage.damage,
			}),
		);
		world.remove(id, Damage);
	}
}

export = damageHurts;
