/// <reference types="@rbxts/testez/globals" />
import { State } from "./state";

export = (): void => {
	describe("State", () => {
		let state: State;

		beforeEach(() => {
			state = new State();
		});

		it("should have the field `debugEnabled`", () => {
			expect(state.debugEnabled).to.be.ok();
		});

		it("should default to `debugEnabled` = false", () => {
			expect(state.debugEnabled).to.equal(false);
		});
	});
};
