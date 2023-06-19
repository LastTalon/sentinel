/// <reference types="@rbxts/testez/globals" />
import { Loop, World } from "@rbxts/matter";
import { Damage, Health } from "shared/ecs/components";
import damageHurts from "./damageHurts";

export = (): void => {
	describe("system", () => {
		const event = new Instance("BindableEvent");
		let world: World;
		let loop: Loop<[World]>;
		let connections: {
			[index: string]: RBXScriptConnection;
		};

		beforeEach(() => {
			world = new World();
			loop = new Loop(world);
			loop.scheduleSystem(damageHurts);
			connections = loop.begin({
				default: event.Event,
			});
		});

		afterEach(() => {
			for (const [_, connection] of pairs(connections)) {
				connection.Disconnect();
			}
		});

		it("should do nothing if there are no damage components", () => {
			const id = world.spawn(
				Health({
					health: 100,
					maxHealth: 100,
					regeneration: 0,
					armor: 0,
					block: 0,
					evasion: 0,
				}),
			);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(100);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(100);
		});

		it("should reduce health when there is a damage component", () => {
			const id = world.spawn(
				Health({
					health: 100,
					maxHealth: 100,
					regeneration: 0,
					armor: 0,
					block: 0,
					evasion: 0,
				}),
			);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(100);

			world.insert(id, Damage({ damage: 10 }));
			event.Fire();
			expect(world.get(id, Health).health).to.equal(90);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(90);

			world.insert(id, Damage({ damage: 25 }));
			event.Fire();
			expect(world.get(id, Health).health).to.equal(65);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(65);
		});

		it("should remove the damage component after reducing health", () => {
			const id = world.spawn(
				Health({
					health: 100,
					maxHealth: 100,
					regeneration: 0,
					armor: 0,
					block: 0,
					evasion: 0,
				}),
			);
			event.Fire();
			expect(world.get(id, Health).health).to.equal(100);

			world.insert(id, Damage({ damage: 10 }));
			expect(world.get(id, Damage)).to.be.ok();
			event.Fire();
			expect(world.get(id, Damage)).never.to.be.ok();
			event.Fire();
			expect(world.get(id, Damage)).never.to.be.ok();
		});

		it("should do nothing when there is no health", () => {
			const id = world.spawn(Damage({ damage: 10 }));
			expect(world.get(id, Damage)).to.be.ok();
			event.Fire();
			expect(world.get(id, Damage)).to.be.ok();
		});
	});
};
