/// <reference types="@rbxts/testez/globals" />
import { Loop, World } from "@rbxts/matter";
import * as Components from "shared/components";
import { Model } from "shared/components";
import { getEvent } from "shared/remotes";
import replication from "./replication";

type ComponentName = keyof typeof Components;
type ComponentConstructor = (typeof Components)[ComponentName];
type ComponentType = Parameters<ComponentConstructor>[0];
type Payload = Map<string, Map<ComponentName, { data?: ComponentType }>>;

export = (): void => {
	const event = new Instance("BindableEvent");
	const replicationPayloads: Payload[] = [];
	let replicationEvent: RemoteEvent;
	let replicationConnection: RBXScriptConnection;
	let world: World;
	let loop: Loop<[World]>;
	let connections: {
		[index: string]: RBXScriptConnection;
	};

	beforeEach(() => {
		replicationPayloads.clear();
		replicationEvent = getEvent("EcsReplication");
		replicationConnection = replicationEvent.OnClientEvent.Connect((payload: Payload) => {
			replicationPayloads.push(payload);
		});
		world = new World();
		loop = new Loop(world);
		loop.scheduleSystem(replication);
		connections = loop.begin({
			default: event.Event,
		});
	});

	afterEach(() => {
		replicationConnection.Disconnect();
		for (const [_, connection] of pairs(connections)) {
			connection.Disconnect();
		}
	});

	describe("system", () => {
		it("should not send a payload with no changes", () => {
			event.Fire();
			expect(replicationPayloads.size()).to.equal(0);
		});

		it("should send a payload when there are spawns", () => {
			event.Fire();
			expect(replicationPayloads.size()).to.equal(0);
			world.spawn(Model());
			event.Fire();
			expect(replicationPayloads.size()).to.equal(1);
		});

		it("should send a payload when there are despawns", () => {
			event.Fire();
			expect(replicationPayloads.size()).to.equal(0);
			const entity = world.spawn(Model());
			event.Fire();
			expect(replicationPayloads.size()).to.equal(1);
			world.despawn(entity);
			event.Fire();
			expect(replicationPayloads.size()).to.equal(2);
		});

		it("should send a payload when there are additions", () => {
			event.Fire();
			expect(replicationPayloads.size()).to.equal(0);
			const entity = world.spawn(Model());
			event.Fire();
			expect(replicationPayloads.size()).to.equal(1);
			world.insert(entity, Model());
			event.Fire();
			expect(replicationPayloads.size()).to.equal(2);
		});

		it("should send a payload when there are deletions", () => {
			event.Fire();
			expect(replicationPayloads.size()).to.equal(0);
			const entity = world.spawn(Model());
			event.Fire();
			expect(replicationPayloads.size()).to.equal(1);
			world.remove(entity, Model);
			event.Fire();
			expect(replicationPayloads.size()).to.equal(2);
		});

		it("should send a payload only on ticks with changes", () => {
			event.Fire();
			expect(replicationPayloads.size()).to.equal(0);
			world.spawn(Model());
			event.Fire();
			expect(replicationPayloads.size()).to.equal(1);
			event.Fire();
			expect(replicationPayloads.size()).to.equal(1);
			event.Fire();
			expect(replicationPayloads.size()).to.equal(1);
			world.spawn(Model());
			event.Fire();
			expect(replicationPayloads.size()).to.equal(2);
			world.spawn(Model());
			world.spawn(Model());
			world.spawn(Model());
			event.Fire();
			expect(replicationPayloads.size()).to.equal(3);
			event.Fire();
			expect(replicationPayloads.size()).to.equal(3);
		});
	});

	describe("payload", () => {
		it("should use a component map when spawning entities", () => {
			const entity = world.spawn(Model());
			event.Fire();
			const payload = replicationPayloads[0];
			expect(payload).to.be.ok();
			const entityData = payload.get(tostring(entity));
			expect(entityData?.isEmpty()).to.equal(false);
		});

		it("should use an empty component map when despawning entities", () => {
			const entity = world.spawn(Model());
			event.Fire();
			world.despawn(entity);
			event.Fire();
			const payload = replicationPayloads[1];
			expect(payload).to.be.ok();
			const entityData = payload.get(tostring(entity));
			expect(entityData?.isEmpty()).to.equal(true);
		});

		it("should use a data field when inserting components", () => {
			const entity = world.spawn(Model());
			event.Fire();
			const payload = replicationPayloads[0];
			const entityData = payload.get(tostring(entity));
			const componentData = entityData?.get(tostring(Model) as ComponentName);
			expect(componentData?.data).to.be.ok();
		});

		it("should not use a data field when deleting components", () => {
			const entity = world.spawn(Model());
			event.Fire();
			world.remove(entity, Model);
			event.Fire();
			const payload = replicationPayloads[1];
			const entityData = payload.get(tostring(entity));
			const componentData = entityData?.get(tostring(Model) as ComponentName);
			expect(componentData?.data).never.to.be.ok();
		});
	});
};
