/// <reference types="@rbxts/testez/globals" />
import { Loop, World } from "@rbxts/matter";
import { Workspace } from "@rbxts/services";
import { Model, Transform } from "shared/components";
import removeMissingModels from "./removeMissingModels";
import updateTransforms from "./updateTransforms";

export = (): void => {
	FOCUS();

	describe("system", () => {
		const event = new Instance("BindableEvent");
		let instance: Model;
		let world: World;
		let loop: Loop<[World]>;
		let connections: {
			[index: string]: RBXScriptConnection;
		};

		beforeEach(() => {
			instance = new Instance("Model");
			instance.Parent = Workspace;
			world = new World();
			loop = new Loop(world);
			loop.scheduleSystems([updateTransforms, removeMissingModels]);
			connections = loop.begin({
				default: event.Event,
			});
		});

		afterEach(() => {
			instance.Destroy();
			for (const [_, connection] of pairs(connections)) {
				connection.Disconnect();
			}
		});

		it("should move Models to their Transform when the Transform is updated", () => {
			const origin = instance.GetPivot();
			const update = origin.add(new Vector3(0, 1, 0));
			const entity = world.spawn(
				Model({
					model: instance,
				}),
				Transform({
					cframe: origin,
				}),
			);
			event.Fire();
			expect(instance.GetPivot()).to.equal(origin);
			world.insert(
				entity,
				Transform({
					cframe: update,
				}),
			);
			event.Fire();
			expect(instance.GetPivot()).to.equal(update);
		});

		it("should move Models to their Transform when the Model is updated", () => {
			const origin = instance.GetPivot();
			const update = origin.add(new Vector3(0, 1, 0));
			const entity = world.spawn(
				Model({
					model: undefined,
				}),
				Transform({
					cframe: update,
				}),
			);
			event.Fire();
			expect(instance.GetPivot()).to.equal(origin);
			world.insert(
				entity,
				Model({
					model: instance,
				}),
			);
			event.Fire();
			expect(instance.GetPivot()).to.equal(update);
		});

		it("should update Transforms when the Model moves", () => {
			const part = new Instance("Part");
			part.Parent = instance;
			part.Anchored = false;
			instance.PrimaryPart = part;
			const origin = instance.GetPivot();
			const update = origin.add(new Vector3(0, 1, 0));
			const entity = world.spawn(
				Model({
					model: instance,
				}),
				Transform({
					cframe: origin,
				}),
			);
			event.Fire();
			expect(world.get(entity, Transform).cframe).to.equal(origin);
			instance.PivotTo(update);
			event.Fire();
			expect(world.get(entity, Transform).cframe).to.equal(update);
		});
	});
};
