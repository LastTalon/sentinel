/// <reference types="@rbxts/testez/globals" />
import { Model, Test, Transform } from "./components";

export = (): void => {
	describe("Model", () => {
		it("should create a component", () => {
			expect(Model()).to.be.ok();
		});

		it("should be named 'Model'", () => {
			expect(tostring(Model)).to.equal("Model");
		});

		it("should have no default model", () => {
			const model = Model();
			expect(model.model).never.to.be.ok();
		});
	});

	describe("Transform", () => {
		it("should create a component", () => {
			expect(Transform()).to.be.ok();
		});

		it("should be named 'Transform'", () => {
			expect(tostring(Transform)).to.equal("Transform");
		});

		it("should have a default cframe of the identity cframe", () => {
			const transform = Transform();
			expect(transform.cframe).to.equal(CFrame.identity);
		});
	});

	describe("Test", () => {
		it("should create a component", () => {
			expect(Test()).to.be.ok();
		});

		it("should be named 'Test'", () => {
			expect(tostring(Test)).to.equal("Test");
		});
	});
};
