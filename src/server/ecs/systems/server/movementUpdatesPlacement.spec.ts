/// <reference types="@rbxts/testez/globals" />
import { Loop, World } from "@rbxts/matter";
import { GamePlacement, Movement } from "shared/ecs/components";
import movementUpdatesPlacement from "./movementUpdatesPlacement";

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
			loop.scheduleSystem(movementUpdatesPlacement);
			connections = loop.begin({
				default: event.Event,
			});
		});

		afterEach(() => {
			for (const [_, connection] of pairs(connections)) {
				connection.Disconnect();
			}
		});

		it("should not limit velocity when within bounds", () => {
			const id = world.spawn(
				Movement({
					velocity: Vector2.zero,
					angularVelocity: 0,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			expect(world.get(id, Movement).velocity).to.equal(Vector2.zero);

			event.Fire();
			expect(world.get(id, Movement).velocity).to.equal(Vector2.zero);

			world.insert(
				id,
				Movement({
					velocity: new Vector2(50, 50),
					angularVelocity: 0,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			event.Fire();
			expect(world.get(id, Movement).velocity).to.equal(new Vector2(50, 50));

			world.insert(
				id,
				Movement({
					velocity: new Vector2(-50, 50),
					angularVelocity: 0,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			event.Fire();
			expect(world.get(id, Movement).velocity).to.equal(new Vector2(-50, 50));
		});

		it("should not limit angularVelocity when within bounds", () => {
			const id = world.spawn(
				Movement({
					velocity: Vector2.zero,
					angularVelocity: 0,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			expect(world.get(id, Movement).angularVelocity).to.equal(0);

			event.Fire();
			expect(world.get(id, Movement).angularVelocity).to.equal(0);

			world.insert(
				id,
				Movement({
					velocity: Vector2.zero,
					angularVelocity: 10,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			event.Fire();
			expect(world.get(id, Movement).angularVelocity).to.equal(10);

			world.insert(
				id,
				Movement({
					velocity: Vector2.zero,
					angularVelocity: -50,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			event.Fire();
			expect(world.get(id, Movement).angularVelocity).to.equal(-50);
		});

		it("should limit velocity when speed increases past maxSpeed", () => {
			const id = world.spawn(
				Movement({
					velocity: Vector2.zero,
					angularVelocity: 0,
					maxSpeed: 5,
					maxAngularSpeed: 100,
				}),
			);
			expect(world.get(id, Movement).velocity).to.equal(Vector2.zero);

			event.Fire();
			expect(world.get(id, Movement).velocity).to.equal(Vector2.zero);

			world.insert(
				id,
				Movement({
					velocity: new Vector2(3, 4),
					angularVelocity: 0,
					maxSpeed: 5,
					maxAngularSpeed: 100,
				}),
			);
			event.Fire();
			expect(world.get(id, Movement).velocity).to.equal(new Vector2(3, 4));

			world.insert(
				id,
				Movement({
					velocity: new Vector2(-30, 40),
					angularVelocity: 0,
					maxSpeed: 5,
					maxAngularSpeed: 100,
				}),
			);
			event.Fire();
			expect(world.get(id, Movement).velocity).to.equal(new Vector2(-3, 4));
		});

		it("should limit angularVelocity when angularSpeed increases past maxAngularSpeed", () => {
			const id = world.spawn(
				Movement({
					velocity: Vector2.zero,
					angularVelocity: 0,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			expect(world.get(id, Movement).angularVelocity).to.equal(0);

			event.Fire();
			expect(world.get(id, Movement).angularVelocity).to.equal(0);

			world.insert(
				id,
				Movement({
					velocity: Vector2.zero,
					angularVelocity: 100,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			event.Fire();
			expect(world.get(id, Movement).angularVelocity).to.equal(100);

			world.insert(
				id,
				Movement({
					velocity: Vector2.zero,
					angularVelocity: 200,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			event.Fire();
			expect(world.get(id, Movement).angularVelocity).to.equal(100);
		});

		it("should limit velocity when maxSpeed reduces past speed", () => {
			const id = world.spawn(
				Movement({
					velocity: new Vector2(-30, 40),
					angularVelocity: 0,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			expect(world.get(id, Movement).velocity).to.equal(new Vector2(-30, 40));

			event.Fire();
			expect(world.get(id, Movement).velocity).to.equal(new Vector2(-30, 40));

			world.insert(
				id,
				Movement({
					velocity: new Vector2(-30, 40),
					angularVelocity: 0,
					maxSpeed: 5,
					maxAngularSpeed: 100,
				}),
			);
			event.Fire();
			expect(world.get(id, Movement).velocity).to.equal(new Vector2(-3, 4));
		});

		it("should limit angularVelocity when maxAngularSpeed reduces past angularSpeed", () => {
			const id = world.spawn(
				Movement({
					velocity: Vector2.zero,
					angularVelocity: 50,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			expect(world.get(id, Movement).angularVelocity).to.equal(50);

			event.Fire();
			expect(world.get(id, Movement).angularVelocity).to.equal(50);

			world.insert(
				id,
				Movement({
					velocity: Vector2.zero,
					angularVelocity: 100,
					maxSpeed: 100,
					maxAngularSpeed: 25,
				}),
			);
			event.Fire();
			expect(world.get(id, Movement).angularVelocity).to.equal(25);
		});

		it("should not update position when there is no movement", () => {
			const id = world.spawn(
				GamePlacement({
					position: Vector2.zero,
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: 0,
				}),
			);
			expect(world.get(id, GamePlacement).position).to.equal(Vector2.zero);
			event.Fire();
			expect(world.get(id, GamePlacement).position).to.equal(Vector2.zero);
		});

		it("should not update orientation when there is no movement", () => {
			const id = world.spawn(
				GamePlacement({
					position: Vector2.zero,
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: 0,
				}),
			);
			expect(world.get(id, GamePlacement).orientation).to.equal(0);
			event.Fire();
			expect(world.get(id, GamePlacement).orientation).to.equal(0);
		});

		it("should update the position by the velocity", () => {
			const id = world.spawn(
				GamePlacement({
					position: Vector2.zero,
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: 0,
				}),
				Movement({
					velocity: new Vector2(1, 1),
					angularVelocity: 0,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			expect(world.get(id, GamePlacement).position).to.equal(new Vector2(0, 0));
			event.Fire();
			expect(world.get(id, GamePlacement).position).to.equal(new Vector2(1, 1));
			event.Fire();
			expect(world.get(id, GamePlacement).position).to.equal(new Vector2(2, 2));
			event.Fire();
			expect(world.get(id, GamePlacement).position).to.equal(new Vector2(3, 3));
		});

		it("should update the orientation by the angularVelocity", () => {
			const id = world.spawn(
				GamePlacement({
					position: Vector2.zero,
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: 0,
				}),
				Movement({
					velocity: Vector2.zero,
					angularVelocity: 5,
					maxSpeed: 100,
					maxAngularSpeed: 100,
				}),
			);
			expect(world.get(id, GamePlacement).orientation).to.equal(0);
			event.Fire();
			expect(world.get(id, GamePlacement).orientation).to.equal(5);
			event.Fire();
			expect(world.get(id, GamePlacement).orientation).to.equal(10);
			event.Fire();
			expect(world.get(id, GamePlacement).orientation).to.equal(15);
		});
	});
};
