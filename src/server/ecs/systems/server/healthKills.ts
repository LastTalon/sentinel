import { World } from "@rbxts/matter";
import { Health, Model } from "shared/ecs/components";

/**
 * A system that mirrors health to Humanoids.
 *
 * If a health component has an attached model that contains a humanoid. This
 * will reflect the changes in health to that humanoid.
 *
 * If the health is out of bounds between 0 and the max health it is clamped
 * between these values.
 */
function healthKills(world: World): void {
	for (const [id, record] of world.queryChanged(Health)) {
		if (!record.new) continue;
		const health = math.clamp(record.new.health, 0, record.new.maxHealth);

		if (health !== record.new.health) {
			world.insert(
				id,
				record.new.patch({
					health: health,
				}),
			);
		}

		const model = world.get(id, Model);
		if (!model) continue;
		const humanoid = model.model?.FindFirstChildOfClass("Humanoid");
		if (humanoid) {
			humanoid.MaxHealth = record.new.maxHealth;
			humanoid.Health = health;
		}
	}
}

export = healthKills;
