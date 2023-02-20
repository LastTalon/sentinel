/// <reference types="@rbxts/testez/globals" />
import { Loop, World } from "@rbxts/matter";
import { Workspace } from "@rbxts/services";
import { Model } from "shared/components";
import removeMissingModels from "./removeMissingModels";

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
			loop.scheduleSystem(removeMissingModels);
			connections = loop.begin({
				default: event.Event,
			});
		});

		afterEach(() => {
			for (const [_, connection] of pairs(connections)) {
				connection.Disconnect();
			}
		});

		it("should remove a Model from an entity that is destroyed", () => {
			const instance = new Instance("Model");
			instance.Parent = Workspace;
			const entity = world.spawn(
				Model({
					model: instance,
				}),
			);
			event.Fire();
			expect(world.get(entity, Model)).to.be.ok();
			instance.Destroy();
			event.Fire();
			expect(world.get(entity, Model)).never.to.be.ok();
		});

		it("should destroy instances when Models are removed", () => {
			const instance = new Instance("Model");
			instance.Parent = Workspace;
			const entity = world.spawn(
				Model({
					model: instance,
				}),
			);
			event.Fire();
			expect(instance.Parent).to.be.ok();
			world.remove(entity, Model);
			event.Fire();
			expect(instance.Parent).never.to.be.ok();
			// Destroy the instance just in case.
			instance.Destroy();
		});

		it("should destroy instances when entities with Models are despawned", () => {
			const instance = new Instance("Model");
			instance.Parent = Workspace;
			const entity = world.spawn(
				Model({
					model: instance,
				}),
			);
			event.Fire();
			expect(instance.Parent).to.be.ok();
			world.despawn(entity);
			event.Fire();
			expect(instance.Parent).never.to.be.ok();
			// Destroy the instance just in case.
			instance.Destroy();
		});
	});
};
