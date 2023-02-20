/// <reference types="@rbxts/testez/globals" />
import { Loop, World } from "@rbxts/matter";
import { Model } from "shared/components";
import { Host } from "shared/hosts";
import { getIdAttribute, setEnvironment } from "shared/idAttribute";
import updateIdAttribute from "./updateIdAttribute";

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
			loop.scheduleSystem(updateIdAttribute);
			connections = loop.begin({
				default: event.Event,
			});
		});

		afterEach(() => {
			for (const [_, connection] of pairs(connections)) {
				connection.Disconnect();
			}
		});

		it("should set the ID attribute of a Model on no host", () => {
			setEnvironment(Host.None);
			const model = new Instance("Part");
			const id = world.spawn(
				Model({
					model: model,
				}),
			);
			expect(model.GetAttribute(getIdAttribute())).never.to.be.ok();
			event.Fire();
			expect(model.GetAttribute(getIdAttribute())).to.equal(id);
		});

		it("should set the ID attribute of a Model on the client", () => {
			setEnvironment(Host.Client);
			const model = new Instance("Part");
			const id = world.spawn(
				Model({
					model: model,
				}),
			);
			expect(model.GetAttribute(getIdAttribute())).never.to.be.ok();
			event.Fire();
			expect(model.GetAttribute(getIdAttribute())).to.equal(id);
		});

		it("should set the ID attribute of a Model on the server", () => {
			setEnvironment(Host.Server);
			const model = new Instance("Part");
			const id = world.spawn(
				Model({
					model: model,
				}),
			);
			expect(model.GetAttribute(getIdAttribute())).never.to.be.ok();
			event.Fire();
			expect(model.GetAttribute(getIdAttribute())).to.equal(id);
		});

		it("should set the ID attribute of a Model on all hosts", () => {
			setEnvironment(Host.All);
			const model = new Instance("Part");
			const id = world.spawn(
				Model({
					model: model,
				}),
			);
			expect(model.GetAttribute(getIdAttribute())).never.to.be.ok();
			event.Fire();
			expect(model.GetAttribute(getIdAttribute())).to.equal(id);
		});
	});
};
