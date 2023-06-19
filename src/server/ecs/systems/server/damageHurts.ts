import { World } from "@rbxts/matter";
import { Damage, Health } from "shared/ecs/components";

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
