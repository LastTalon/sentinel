/// <reference types="@rbxts/testez/globals" />
import { Host } from "./hosts";

export = (): void => {
	describe("None", () => {
		it("should exist", () => {
			expect(Host.None).to.be.ok();
		});

		it("should be unique", () => {
			expect(Host.None).never.to.equal(Host.Client);
			expect(Host.None).never.to.equal(Host.Server);
			expect(Host.None).never.to.equal(Host.All);
		});
	});

	describe("Client", () => {
		it("should exist", () => {
			expect(Host.Client).to.be.ok();
		});

		it("should be unique", () => {
			expect(Host.Client).never.to.equal(Host.None);
			expect(Host.Client).never.to.equal(Host.Server);
			expect(Host.Client).never.to.equal(Host.All);
		});
	});

	describe("Server", () => {
		it("should exist", () => {
			expect(Host.Server).to.be.ok();
		});

		it("should be unique", () => {
			expect(Host.Server).never.to.equal(Host.None);
			expect(Host.Server).never.to.equal(Host.Client);
			expect(Host.Server).never.to.equal(Host.All);
		});
	});

	describe("All", () => {
		it("should exist", () => {
			expect(Host.All).to.be.ok();
		});

		it("should be unique", () => {
			expect(Host.All).never.to.equal(Host.None);
			expect(Host.All).never.to.equal(Host.Client);
			expect(Host.All).never.to.equal(Host.Server);
		});
	});
};
