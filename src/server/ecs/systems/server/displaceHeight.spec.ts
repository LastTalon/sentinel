/// <reference types="@rbxts/testez/globals" />
import { Loop, World } from "@rbxts/matter";
import { GamePlacement, HipHeight, TravelHeight } from "shared/ecs/components";
import displaceHeight from "./displaceHeight";

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
			loop.scheduleSystem(displaceHeight);
			connections = loop.begin({
				default: event.Event,
			});
		});

		afterEach(() => {
			for (const [_, connection] of pairs(connections)) {
				connection.Disconnect();
			}
		});

		it("should do nothing when nothing changes", () => {
			const id = world.spawn(
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: -1000,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(0);

			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(0);
		});

		it("should add the hip height when the hip height changes", () => {
			const id = world.spawn(
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: -1000,
				}),
				HipHeight({
					height: 0,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(0);

			world.insert(
				id,
				HipHeight({
					height: 10,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(10);

			world.insert(
				id,
				HipHeight({
					height: 5,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(5);

			world.insert(
				id,
				HipHeight({
					height: -50,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(-50);
		});

		it("should add the travel height when the travel height changes", () => {
			const id = world.spawn(
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: -1000,
				}),
				TravelHeight({
					height: 0,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(0);

			world.insert(
				id,
				TravelHeight({
					height: 10,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(10);

			world.insert(
				id,
				TravelHeight({
					height: 5,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(5);

			world.insert(
				id,
				TravelHeight({
					height: -50,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(-50);
		});

		it("should add the travel height when the hip height changes", () => {
			const id = world.spawn(
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: -1000,
				}),
				TravelHeight({
					height: 50,
				}),
				HipHeight({
					height: 0,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(50);

			world.insert(
				id,
				HipHeight({
					height: 10,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(60);

			world.insert(
				id,
				HipHeight({
					height: 5,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(55);

			world.insert(
				id,
				HipHeight({
					height: -50,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(0);
		});

		it("should add the hip height when the travel height changes", () => {
			const id = world.spawn(
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: -1000,
				}),
				TravelHeight({
					height: 0,
				}),
				HipHeight({
					height: 50,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(50);

			world.insert(
				id,
				TravelHeight({
					height: 10,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(60);

			world.insert(
				id,
				TravelHeight({
					height: 5,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(55);

			world.insert(
				id,
				TravelHeight({
					height: -50,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(0);
		});

		it("should remain the same after the game placement changes", () => {
			const id = world.spawn(
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: -1000,
				}),
				TravelHeight({
					height: 10,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(10);

			world.insert(
				id,
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: -1000,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(10);
		});

		it("should add the hip height and travel height when both change", () => {
			const id = world.spawn(
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: -1000,
				}),
				TravelHeight({
					height: 0,
				}),
				HipHeight({
					height: 0,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(0);

			world.insert(
				id,
				TravelHeight({
					height: 10,
				}),
				HipHeight({
					height: 10,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(20);

			world.insert(
				id,
				TravelHeight({
					height: 5,
				}),
				HipHeight({
					height: 50,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(55);

			world.insert(
				id,
				TravelHeight({
					height: -50,
				}),
				HipHeight({
					height: 50,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement).offsetHeight).to.equal(0);
		});

		it("should add the heights after a game placement is added", () => {
			const id = world.spawn(
				TravelHeight({
					height: 50,
				}),
				HipHeight({
					height: 10,
				}),
			);
			event.Fire();
			world.insert(
				id,
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 0,
					respectsGeometry: false,
					offsetHeight: -1000,
				}),
			);
			event.Fire();
			expect(world.get(id, GamePlacement)?.offsetHeight).to.equal(60);
		});
	});
};
