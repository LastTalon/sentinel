/// <reference types="@rbxts/testez/globals" />
import { Loop, World } from "@rbxts/matter";
import { Health, Model } from "shared/ecs/components";
import healthKills from "./healthKills";

export = (): void => {
	describe("system", () => {
		const event = new Instance("BindableEvent");
		let model: Model;
		let humanoid: Humanoid;
		let world: World;
		let loop: Loop<[World]>;
		let connections: {
			[index: string]: RBXScriptConnection;
		};

		beforeEach(() => {
			model = new Instance("Model");
			humanoid = new Instance("Humanoid");
			humanoid.Parent = model;
			world = new World();
			loop = new Loop(world);
			loop.scheduleSystem(healthKills);
			connections = loop.begin({
				default: event.Event,
			});
		});

		afterEach(() => {
			model.Destroy();
			for (const [_, connection] of pairs(connections)) {
				connection.Disconnect();
			}
		});

		it("should not adjust health when nothing changes", () => {
			const health = Health({
				health: 100,
				maxHealth: 100,
				regeneration: 0,
				armor: 0,
				block: 0,
				evasion: 0,
			});
			const id = world.spawn(health);
			event.Fire();
			expect(world.get(id, Health)).to.equal(health);
		});

		it("should not adjust health when within normal bounds", () => {
			let health = Health({
				health: 100,
				maxHealth: 100,
				regeneration: 0,
				armor: 0,
				block: 0,
				evasion: 0,
			});
			const id = world.spawn(health);

			event.Fire();
			expect(world.get(id, Health)).to.equal(health);

			health = health.patch({ health: 0 });
			world.insert(id, health);
			event.Fire();
			expect(world.get(id, Health)).to.equal(health);

			health = health.patch({ health: 100 });
			world.insert(id, health);
			event.Fire();
			expect(world.get(id, Health)).to.equal(health);

			health = health.patch({ health: 50 });
			world.insert(id, health);
			event.Fire();
			expect(world.get(id, Health)).to.equal(health);
		});

		it("should reduce health to maxHealth", () => {
			let health = Health({
				health: 100,
				maxHealth: 100,
				regeneration: 0,
				armor: 0,
				block: 0,
				evasion: 0,
			});
			const id = world.spawn(health);

			event.Fire();
			expect(world.get(id, Health)).to.equal(health);

			health = health.patch({ health: 110 });
			world.insert(id, health);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(100);

			health = health.patch({ health: 101 });
			world.insert(id, health);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(100);

			health = health.patch({ health: 50 });
			world.insert(id, health);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(50);

			health = health.patch({ health: 150 });
			world.insert(id, health);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(100);
		});

		it("should increase health to 0", () => {
			let health = Health({
				health: 100,
				maxHealth: 100,
				regeneration: 0,
				armor: 0,
				block: 0,
				evasion: 0,
			});
			const id = world.spawn(health);

			event.Fire();
			expect(world.get(id, Health)).to.equal(health);

			health = health.patch({ health: -10 });
			world.insert(id, health);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(0);

			health = health.patch({ health: -1 });
			world.insert(id, health);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(0);

			health = health.patch({ health: 50 });
			world.insert(id, health);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(50);

			health = health.patch({ health: -50 });
			world.insert(id, health);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(0);
		});

		it("should mirror the health to the humanoid", () => {
			let health = Health({
				health: 100,
				maxHealth: 100,
				regeneration: 0,
				armor: 0,
				block: 0,
				evasion: 0,
			});
			const id = world.spawn(health, Model({ model: model }));

			event.Fire();
			expect(humanoid.Health).to.equal(100);

			health = health.patch({ health: 50 });
			world.insert(id, health);
			event.Fire();
			expect(humanoid.Health).to.equal(50);

			health = health.patch({ health: 100 });
			world.insert(id, health);
			event.Fire();
			expect(humanoid.Health).to.equal(100);

			health = health.patch({ health: 0 });
			world.insert(id, health);
			event.Fire();
			expect(humanoid.Health).to.equal(0);
		});

		it("should mirror the maxHealth to the humanoid", () => {
			let health = Health({
				health: 100,
				maxHealth: 100,
				regeneration: 0,
				armor: 0,
				block: 0,
				evasion: 0,
			});
			const id = world.spawn(health, Model({ model: model }));

			event.Fire();
			expect(humanoid.MaxHealth).to.equal(100);

			health = health.patch({ maxHealth: 50 });
			world.insert(id, health);
			event.Fire();
			expect(humanoid.MaxHealth).to.equal(50);

			health = health.patch({ maxHealth: 100 });
			world.insert(id, health);
			event.Fire();
			expect(humanoid.MaxHealth).to.equal(100);

			health = health.patch({ maxHealth: 0 });
			world.insert(id, health);
			event.Fire();
			expect(humanoid.MaxHealth).to.equal(0);
		});
	});
};
