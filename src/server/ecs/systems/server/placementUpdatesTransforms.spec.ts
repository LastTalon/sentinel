/// <reference types="@rbxts/testez/globals" />
import { Loop, World } from "@rbxts/matter";
import { GamePlacement, HipHeight, Transform } from "shared/ecs/components";
import displaceHeight from "./displaceHeight";
import movementUpdatesPlacement from "./movementUpdatesPlacement";
import placementUpdatesTransforms from "./placementUpdatesTransforms";

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
			loop.scheduleSystems([placementUpdatesTransforms, movementUpdatesPlacement, displaceHeight]);
			connections = loop.begin({
				default: event.Event,
			});
		});

		afterEach(() => {
			for (const [_, connection] of pairs(connections)) {
				connection.Disconnect();
			}
		});

		it("should update transforms", () => {
			const entity = world.spawn(
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 0,
					offsetHeight: 0,
					respectsGeometry: false,
				}),
				Transform({
					cframe: new CFrame(100, 0, 100),
				}),
			);

			event.Fire();
			expect(world.get(entity, Transform).cframe).to.equal(new CFrame(0, 0, 0));
		});

		it("should update transforms with offset height", () => {
			const entity = world.spawn(
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 0,
					offsetHeight: 0,
					respectsGeometry: false,
				}),
				Transform({
					cframe: new CFrame(100, 0, 100),
				}),
				HipHeight({
					height: 10,
				}),
			);

			event.Fire();
			expect(world.get(entity, Transform).cframe).to.equal(new CFrame(0, 10, 0));
		});

		itFIXME("should update transforms with respects geometry", () => {
			// This test is broken because the geometry height is not being set
		});

		it("should update transform position", () => {
			const entity = world.spawn(
				GamePlacement({
					position: new Vector2(10, 500),
					orientation: 0,
					offsetHeight: 0,
					respectsGeometry: false,
				}),
				Transform({
					cframe: new CFrame(100, 0, 100),
				}),
			);

			event.Fire();
			expect(world.get(entity, Transform).cframe).to.equal(new CFrame(10, 0, 500));
		});

		it("should update transform orientation", () => {
			const entity = world.spawn(
				GamePlacement({
					position: new Vector2(0, 0),
					orientation: 90,
					offsetHeight: 0,
					respectsGeometry: false,
				}),
				Transform({
					cframe: new CFrame(100, 0, 100),
				}),
			);

			event.Fire();
			expect(world.get(entity, Transform).cframe).to.equal(
				new CFrame(0, 0, 0).mul(CFrame.fromOrientation(0, math.rad(90), 0)),
			);
		});

		it("should update transform with a complex combination", () => {
			const entity = world.spawn(
				GamePlacement({
					position: new Vector2(10, 500),
					orientation: 90,
					offsetHeight: 0,
					respectsGeometry: false,
				}),
				Transform({
					cframe: new CFrame(100, 0, 100),
				}),
				HipHeight({
					height: 10,
				}),
			);

			event.Fire();
			expect(world.get(entity, Transform).cframe).to.equal(
				new CFrame(10, 10, 500).mul(CFrame.fromOrientation(0, math.rad(90), 0)),
			);
		});
	});
};
