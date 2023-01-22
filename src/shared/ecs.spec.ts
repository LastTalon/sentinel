/// <reference types="@rbxts/testez/globals" />
import { Host } from "shared/hosts";
import { start, stop } from "./ecs";

export = (): void => {
	describe("ecs", () => {
		// Matter's debugger assumes the client implies a player exists (or will
		// shortly). When running in studio this is not necessarily the case, so
		// these always fail due to the debugger initialization.
		FIXME();

		describe("start", () => {
			afterEach(() => {
				stop();
			});

			it("should not throw for None", () => {
				expect(() => start(Host.None)).never.to.throw();
			});

			it("should not throw for Client", () => {
				expect(() => start(Host.Client)).never.to.throw();
			});

			it("should not throw for Server", () => {
				expect(() => start(Host.Server)).never.to.throw();
			});

			it("should not throw for All", () => {
				expect(() => start(Host.All)).never.to.throw();
			});
		});

		describe("stop", () => {
			beforeEach(() => {
				start(Host.All);
			});

			it("should not throw", () => {
				expect(() => stop()).never.to.throw();
			});
		});
	});
};
