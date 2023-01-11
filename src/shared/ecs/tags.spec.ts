/// <reference types="@rbxts/testez/globals" />
import { CollectionService } from "@rbxts/services";
import { component } from "@rbxts/matter";
import { Transform, Model } from "shared/components/archetypes";
import { MockWorld, mockWorld } from "./mockWorld.dev";
import { ComponentConstructor, start, stop } from "./tags";

const TestComponent1 = component("Test1", {
	message: "Hello",
});
const TestComponent2 = component("Test2", {
	value: false,
});
const TestComponent3 = component("Test3");

const tags = new ReadonlyMap<string, ComponentConstructor<object>>([
	["Test1", TestComponent1],
	["Test2", TestComponent2],
	["Test3", TestComponent3],
]);

const referenceModel = new Instance("Model");
const referencePart = new Instance("Part");
referencePart.Parent = referenceModel;
referenceModel.PrimaryPart = referencePart;

export = (): void => {
	let world: MockWorld;

	beforeEach(() => {
		world = mockWorld();
	});

	describe("start", () => {
		afterEach(() => {
			stop();
		});

		it("should spawn a tagged Part when tagged early", () => {
			const part = referencePart.Clone();
			expect(world.entities[0]).never.to.be.ok();
			CollectionService.AddTag(part, "Test1");
			part.Parent = script;
			start(world, tags);
			expect(world.entities[0]).to.be.ok();
			part.Destroy();
		});

		it("should spawn a tagged Model when tagged early", () => {
			const model = referenceModel.Clone();
			expect(world.entities[0]).never.to.be.ok();
			CollectionService.AddTag(model, "Test2");
			model.Parent = script;
			start(world, tags);
			expect(world.entities[0]).to.be.ok();
			model.Destroy();
		});
	});

	describe("stop", () => {
		beforeEach(() => {
			start(world, tags);
		});

		it("should not spawn a tagged Part when tagged late", () => {
			const part = referencePart.Clone();
			expect(world.entities[0]).never.to.be.ok();
			stop();
			CollectionService.AddTag(part, "Test1");
			part.Parent = script;
			expect(world.entities[0]).never.to.be.ok();
			part.Destroy();
		});

		it("should not spawn a tagged Model when tagged late", () => {
			const model = referenceModel.Clone();
			expect(world.entities[0]).never.to.be.ok();
			stop();
			CollectionService.AddTag(model, "Test2");
			model.Parent = script;
			expect(world.entities[0]).never.to.be.ok();
			model.Destroy();
		});

		it("should leave an instance spawned after stopped", () => {
			const model = referenceModel.Clone();
			expect(world.entities[0]).never.to.be.ok();
			CollectionService.AddTag(model, "Test2");
			model.Parent = script;
			expect(world.entities[0]).to.be.ok();
			stop();
			expect(world.entities[0]).to.be.ok();
			model.Destroy();
		});
	});

	describe("Events", () => {
		beforeEach(() => {
			start(world, tags);
		});

		afterEach(() => {
			stop();
		});

		it("should spawn a tagged Part", () => {
			const part = referencePart.Clone();
			expect(world.entities[0]).never.to.be.ok();
			CollectionService.AddTag(part, "Test1");
			part.Parent = script;
			expect(world.entities[0]).to.be.ok();
			part.Destroy();
		});

		it("should spawn a tagged Model", () => {
			const model = referenceModel.Clone();
			expect(world.entities[0]).never.to.be.ok();
			CollectionService.AddTag(model, "Test2");
			model.Parent = script;
			expect(world.entities[0]).to.be.ok();
			model.Destroy();
		});

		it("should fail when attempting to spawn a model with no PrimaryPart", () => {
			const model = new Instance("Model");
			expect(world.entities[0]).never.to.be.ok();
			CollectionService.AddTag(model, "Test2");
			model.Parent = script;
			expect(world.entities[0]).never.to.be.ok();
			model.Destroy();
		});

		it("should fail when attempting to spawn an instance that isn't a Model or BasePart", () => {
			const folder = new Instance("Folder");
			expect(world.entities[0]).never.to.be.ok();
			CollectionService.AddTag(folder, "Test2");
			folder.Parent = script;
			expect(world.entities[0]).never.to.be.ok();
			folder.Destroy();
		});

		it("should despawn a tagged instance when the tag is removed", () => {
			const model = referenceModel.Clone();
			expect(world.entities[0]).never.to.be.ok();
			CollectionService.AddTag(model, "Test3");
			model.Parent = script;
			expect(world.entities[0]).to.be.ok();
			CollectionService.RemoveTag(model, "Test3");
			expect(world.entities[0]).never.to.be.ok();
			model.Destroy();
		});

		it("should spawn the appropriate component", () => {
			const model1 = referenceModel.Clone();
			expect(world.entities[0]).never.to.be.ok();
			CollectionService.AddTag(model1, "Test1");
			model1.Parent = script;
			expect(world.entities[0]).to.be.ok();

			const entity1 = world.entities[0];
			let found = false;
			for (const component of entity1.insert) {
				if ((component as { message?: string }).message === "Hello") {
					found = true;
					break;
				}
			}
			expect(found).to.equal(true);
			model1.Destroy();

			const model2 = referenceModel.Clone();
			expect(world.entities[0]).never.to.be.ok();
			CollectionService.AddTag(model2, "Test2");
			model2.Parent = script;
			expect(world.entities[0]).to.be.ok();

			const entity2 = world.entities[0];
			found = false;
			for (const component of entity2.insert) {
				if ((component as { value?: boolean }).value === false) {
					found = true;
					break;
				}
			}
			expect(found).to.equal(true);
			model2.Destroy();
		});

		it("should spawn a Model and Transform component", () => {
			const model = referenceModel.Clone();
			expect(world.entities[0]).never.to.be.ok();
			CollectionService.AddTag(model, "Test3");
			model.Parent = script;
			expect(world.entities[0]).to.be.ok();

			const entity1 = world.entities[0];
			let foundModel = false;
			let foundTransform = false;
			for (const inserted of entity1.insert) {
				if (foundModel && foundTransform) break;
				const component: unknown = inserted;
				if ((component as Model).model) {
					expect((component as Model).model).to.equal(model);
					foundModel = true;
					continue;
				}
				if ((component as Transform).cframe) {
					expect((component as Transform).cframe).to.equal(model.PrimaryPart?.CFrame);
					foundTransform = true;
					continue;
				}
			}
			expect(foundModel).to.equal(true);
			expect(foundTransform).to.equal(true);
			model.Destroy();
		});
	});
};
