/// <reference types="@rbxts/testez/globals" />
import { tags } from "./boundTags";

export = (): void => {
	describe("tags", () => {
		it("should have an 'Example' tag", () => {
			// This is temporary. It does not matter what value this has, just that it
			// is set.
			expect(tags.get("Example")).to.be.ok();
		});
	});
};
