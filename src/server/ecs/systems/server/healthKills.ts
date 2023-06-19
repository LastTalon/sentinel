import { World } from "@rbxts/matter";
import { Health, Model } from "shared/ecs/components";

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
