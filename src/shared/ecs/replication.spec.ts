/// <reference types="@rbxts/testez/globals" />
import { destroyEvent, getEvent } from "shared/remotes";
import { State } from "./state";
import { MockWorld, mockWorld } from "./mockWorld.dev";
import { start, stop } from "./replication";

export = (): void => {
	let world: MockWorld;
	let state: State;
	let event: RemoteEvent;

	beforeEach(() => {
		world = mockWorld();
		state = new State();
	});

	describe("start", () => {
		afterEach(() => {
			stop();
			destroyEvent("EcsReplication");
		});

		it("should start synchronously when the event exists", () => {
			event = getEvent("EcsReplication");
			let started = false;
			task.spawn(() => {
				start(world, state);
				started = true;
			});
			expect(started).to.equal(true);
		});

		it("should wait to start when the event doesn't exist", () => {
			let started = false;
			task.spawn(() => {
				start(world, state);
				started = true;
			});
			expect(started).to.equal(false);
			event = getEvent("EcsReplication");
			task.wait(0.01);
			expect(started).to.equal(true);
		});

		it("should not respond to events until started", () => {
			event = getEvent("EcsReplication");
			event.FireAllClients(new Map([["1", new Map([["Test", { data: {} }]])]]));
			expect(world.entities.size()).to.equal(0);
			start(world, state);
			expect(world.entities.size() > 0).to.equal(true);
		});
	});

	describe("stop", () => {
		beforeEach(() => {
			event = getEvent("EcsReplication");
			start(world, state);
		});

		afterEach(() => {
			destroyEvent("EcsReplication");
		});

		it("should not respond to events after stopped", () => {
			event.FireAllClients(new Map([["1", new Map([["Test", { data: {} }]])]]));
			expect(world.entities.size()).to.equal(1);
			stop();
			event.FireAllClients(new Map([["2", new Map([["Test", { data: {} }]])]]));
			expect(world.entities.size()).to.equal(1);
		});
	});

	describe("Events", () => {
		beforeEach(() => {
			event = getEvent("EcsReplication");
			start(world, state);
		});

		afterEach(() => {
			stop();
			destroyEvent("EcsReplication");
		});

		it("should add new entities", () => {
			expect(world.entities.size()).to.equal(0);
			event.FireAllClients(
				new Map([
					["1", new Map()],
					["2", new Map()],
					["3", new Map()],
				]),
			);
			expect(world.entities.size()).to.equal(3);
		});

		it("should add new entities with components", () => {
			expect(world.entities.size()).to.equal(0);
			event.FireAllClients(
				new Map([
					["1", new Map([["Test", { data: {} }]])],
					["2", new Map([["Test", { data: {} }]])],
					["3", new Map([["Test", { data: {} }]])],
				]),
			);
			expect(world.entities.size()).to.equal(3);
			expect(world.entities[0].insert.size()).to.equal(1);
			expect(world.entities[1].insert.size()).to.equal(1);
			expect(world.entities[2].insert.size()).to.equal(1);
		});

		it("should add new entities multiple times", () => {
			expect(world.entities.size()).to.equal(0);
			event.FireAllClients(
				new Map([
					["1", new Map([["Test", { data: {} }]])],
					["2", new Map([["Test", { data: {} }]])],
					["3", new Map([["Test", { data: {} }]])],
				]),
			);
			expect(world.entities.size()).to.equal(3);
			event.FireAllClients(
				new Map([
					["4", new Map([["Test", { data: {} }]])],
					["5", new Map([["Test", { data: {} }]])],
					["6", new Map([["Test", { data: {} }]])],
				]),
			);
			expect(world.entities.size()).to.equal(6);
		});

		it("should not add duplicate entities", () => {
			expect(world.entities.size()).to.equal(0);
			event.FireAllClients(
				new Map([
					["1", new Map([["Test", { data: {} }]])],
					["2", new Map([["Test", { data: {} }]])],
					["3", new Map([["Test", { data: {} }]])],
				]),
			);
			expect(world.entities.size()).to.equal(3);
			event.FireAllClients(
				new Map([
					["1", new Map([["Test", { data: {} }]])],
					["2", new Map([["Test", { data: {} }]])],
					["3", new Map([["Test", { data: {} }]])],
				]),
			);
			expect(world.entities.size()).to.equal(3);
		});

		it("should remove entities", () => {
			expect(world.entities.size()).to.equal(0);
			event.FireAllClients(
				new Map([
					["1", new Map()],
					["2", new Map()],
					["3", new Map()],
				]),
			);
			expect(world.entities.size()).to.equal(3);
			event.FireAllClients(
				new Map([
					["1", new Map()],
					["2", new Map()],
					["3", new Map()],
				]),
			);
			expect(world.entities.size()).to.equal(0);
		});

		it("should add new components", () => {
			expect(world.entities.size()).to.equal(0);
			event.FireAllClients(
				new Map([
					["1", new Map()],
					["2", new Map()],
					["3", new Map()],
				]),
			);
			expect(world.entities.size()).to.equal(3);
			expect(world.entities[0].insert.size()).to.equal(0);
			expect(world.entities[1].insert.size()).to.equal(0);
			expect(world.entities[2].insert.size()).to.equal(0);

			event.FireAllClients(
				new Map([
					["1", new Map([["Test", { data: {} }]])],
					["2", new Map([["Test", { data: {} }]])],
					["3", new Map([["Test", { data: {} }]])],
				]),
			);
			expect(world.entities.size()).to.equal(3);
			expect(world.entities[0].insert.size()).to.equal(1);
			expect(world.entities[1].insert.size()).to.equal(1);
			expect(world.entities[2].insert.size()).to.equal(1);
		});

		it("should update components", () => {
			expect(world.entities.size()).to.equal(0);
			event.FireAllClients(
				new Map([
					["1", new Map([["Test", { data: {} }]])],
					["2", new Map([["Test", { data: {} }]])],
					["3", new Map([["Test", { data: {} }]])],
				]),
			);
			expect(world.entities.size()).to.equal(3);
			expect(world.entities[0].insert.size()).to.equal(1);
			expect(world.entities[1].insert.size()).to.equal(1);
			expect(world.entities[2].insert.size()).to.equal(1);

			event.FireAllClients(
				new Map([
					["1", new Map([["Test", { data: {} }]])],
					["2", new Map([["Test", { data: {} }]])],
					["3", new Map([["Test", { data: {} }]])],
				]),
			);
			expect(world.entities.size()).to.equal(3);
			expect(world.entities[0].insert.size()).to.equal(2);
			expect(world.entities[1].insert.size()).to.equal(2);
			expect(world.entities[2].insert.size()).to.equal(2);
		});

		it("should remove components", () => {
			expect(world.entities.size()).to.equal(0);
			event.FireAllClients(
				new Map([
					["1", new Map([["Test", { data: {} }]])],
					["2", new Map([["Test", { data: {} }]])],
					["3", new Map([["Test", { data: {} }]])],
				]),
			);
			expect(world.entities.size()).to.equal(3);
			expect(world.entities[0].insert.size()).to.equal(1);
			expect(world.entities[1].insert.size()).to.equal(1);
			expect(world.entities[2].insert.size()).to.equal(1);

			event.FireAllClients(
				new Map([
					["1", new Map([["Test", {}]])],
					["2", new Map([["Test", {}]])],
					["3", new Map([["Test", {}]])],
				]),
			);
			expect(world.entities.size()).to.equal(3);
			expect(world.entities[0].remove.size()).to.equal(1);
			expect(world.entities[1].remove.size()).to.equal(1);
			expect(world.entities[2].remove.size()).to.equal(1);
		});
	});
};
