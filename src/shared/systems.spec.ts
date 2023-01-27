/// <reference types="@rbxts/testez/globals" />
import { ReplicatedStorage } from "@rbxts/services";
import { AnySystem, Debugger, Loop } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import { Host } from "shared/hosts";
import { start, stop } from "./systems";

interface MockLoop extends Loop<unknown[]> {
	systems: AnySystem[];
}

function mockLoop(): MockLoop {
	const loop = new Loop() as unknown as MockLoop;
	loop.systems = [];

	loop.scheduleSystems = (<S extends Array<AnySystem>>(_: never, systems: S): void => {
		loop.systems = systems;
	}) as <S extends Array<AnySystem>>(systems: S) => void;

	return loop;
}

export = (): void => {
	describe("systems", () => {
		let debug: Debugger;
		let loop: MockLoop;

		beforeAll(() => {
			debug = new Debugger(Plasma);
		});

		afterAll(() => {
			ReplicatedStorage.FindFirstChild("MatterDebuggerRemote")?.Destroy();
		});

		describe("start", () => {
			beforeEach(() => {
				loop = mockLoop();
			});

			afterEach(() => {
				stop();
			});

			it("should not throw for None", () => {
				expect(() => start(Host.None, loop, debug)).never.to.throw();
			});

			it("should not throw for Client", () => {
				expect(() => start(Host.Client, loop, debug)).never.to.throw();
			});

			it("should not throw for Server", () => {
				expect(() => start(Host.Server, loop, debug)).never.to.throw();
			});

			it("should not throw for All", () => {
				expect(() => start(Host.All, loop, debug)).never.to.throw();
			});

			it("should schedule systems for None", () => {
				start(Host.None, loop, debug);
				expect(loop.systems.isEmpty()).to.equal(false);
			});

			it("should schedule systems for Client", () => {
				start(Host.Client, loop, debug);
				expect(loop.systems.isEmpty()).to.equal(false);
			});

			it("should schedule systems for Server", () => {
				start(Host.Server, loop, debug);
				expect(loop.systems.isEmpty()).to.equal(false);
			});

			it("should schedule systems for All", () => {
				start(Host.All, loop, debug);
				expect(loop.systems.isEmpty()).to.equal(false);
			});
		});

		describe("stop", () => {
			beforeEach(() => {
				loop = mockLoop();
				start(Host.All, loop, debug);
			});

			it("should not throw", () => {
				expect(() => stop()).never.to.throw();
			});
		});
	});
};
