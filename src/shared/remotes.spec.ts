/// <reference types="@rbxts/testez/globals" />
import {
	destroyEvent,
	destroyFunction,
	getEvent,
	getEventOrFail,
	getFunction,
	getFunctionOrFail,
	waitForEvent,
	waitForFunction,
} from "./remotes";

export = (): void => {
	describe("getEvent", () => {
		afterEach(() => {
			destroyEvent("Test");
		});

		it("should create a new event", () => {
			expect(getEvent("Test")).to.be.ok();
		});

		it("should find a created event", () => {
			getEvent("Test");
			expect(getEvent("Test")).to.be.ok();
		});

		it("should find an injected event", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteEvent");
			instance.Name = "Test";
			instance.Parent = module;
			expect(getEvent("Test")).to.equal(instance);
		});

		it("should find the same event each time", () => {
			const event = getEvent("Test");
			expect(getEvent("Test")).to.equal(event);
			expect(getEvent("Test")).to.equal(event);
		});

		it("should add a created event to the data model", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const event = getEvent("Test");
			expect(module?.FindFirstChild("Test")).to.equal(event);
		});

		it("should create a new event when finding a non-event", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteFunction");
			instance.Name = "Test";
			instance.Parent = module;
			const event = getEvent("Test");
			expect(event).to.be.ok();
			expect(event).never.to.equal(instance);
			instance.Destroy();
		});
	});

	describe("getEventOrFail", () => {
		afterEach(() => {
			destroyEvent("Test");
		});

		it("should never create a new event", () => {
			expect(() => getEventOrFail("Test")).to.throw(
				"Event 'Test' was requested, but no such remote event exists.",
			);
		});

		it("should find a created event", () => {
			getEvent("Test");
			let event;
			expect(() => {
				event = getEventOrFail("Test");
			}).never.to.throw();
			expect(event).to.be.ok();
		});

		it("should find an injected event", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteEvent");
			instance.Name = "Test";
			instance.Parent = module;
			let event;
			expect(() => {
				event = getEventOrFail("Test");
			}).never.to.throw();
			expect(event).to.equal(instance);
		});

		it("should find the same event each time", () => {
			const event = getEvent("Test");
			expect(getEventOrFail("Test")).to.equal(event);
			expect(getEventOrFail("Test")).to.equal(event);
		});

		it("should fail when finding a non-event", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteFunction");
			instance.Name = "Test";
			instance.Parent = module;
			expect(() => getEventOrFail("Test")).to.throw(
				"Event 'Test' was requested, but was not a remote event.",
			);
			instance.Destroy();
		});
	});

	describe("waitForEvent", () => {
		afterEach(() => {
			destroyEvent("Test");
		});

		it("should never create a new event", () => {
			expect(waitForEvent("Test", 0.1)).never.to.be.ok();
		});

		it("should find a created event", () => {
			getEvent("Test");
			expect(waitForEvent("Test")).to.be.ok();
		});

		it("should find an injected event", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteEvent");
			instance.Name = "Test";
			instance.Parent = module;
			expect(waitForEvent("Test")).to.equal(instance);
		});

		it("should find the same event each time", () => {
			const event = getEvent("Test");
			expect(waitForEvent("Test")).to.equal(event);
			expect(waitForEvent("Test")).to.equal(event);
		});

		it("should fail when finding a non-event", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteFunction");
			instance.Name = "Test";
			instance.Parent = module;
			expect(() => waitForEvent("Test")).to.throw(
				"Event 'Test' was requested, but was not a remote event.",
			);
			instance.Destroy();
		});

		it("should wait for an event", () => {
			task.spawn(() => {
				task.wait();
				getEvent("Test");
			});
			expect(() => getEventOrFail("Test")).to.throw();
			expect(waitForEvent("Test")).to.be.ok();
		});
	});

	describe("destroyEvent", () => {
		it("should allow destroy attempts on events that don't exist", () => {
			expect(() => {
				destroyEvent("Test");
			}).never.to.throw();
		});

		it("should no longer find the event", () => {
			expect(getEvent("Test")).to.be.ok();
			destroyEvent("Test");
			expect(() => getEventOrFail("Test")).to.throw();
		});

		it("should destroy the remote event in the data model", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			getEvent("Test");
			expect(module?.FindFirstChild("Test")).to.be.ok();
			destroyEvent("Test");
			expect(module?.FindFirstChild("Test")).never.to.be.ok();
		});
	});

	describe("getFunction", () => {
		afterEach(() => {
			destroyFunction("Test");
		});

		it("should create a new function", () => {
			expect(getFunction("Test")).to.be.ok();
		});

		it("should find a created event", () => {
			getFunction("Test");
			expect(getFunction("Test")).to.be.ok();
		});

		it("should find an injected function", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteFunction");
			instance.Name = "Test";
			instance.Parent = module;
			expect(getFunction("Test")).to.equal(instance);
		});

		it("should find the same function each time", () => {
			const fn = getFunction("Test");
			expect(getFunction("Test")).to.equal(fn);
			expect(getFunction("Test")).to.equal(fn);
		});

		it("should add a created function to the data model", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const fn = getFunction("Test");
			expect(module?.FindFirstChild("Test")).to.equal(fn);
		});

		it("should create a new function when finding a non-function", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteEvent");
			instance.Name = "Test";
			instance.Parent = module;
			const fn = getFunction("Test");
			expect(fn).to.be.ok();
			expect(fn).never.to.equal(instance);
			instance.Destroy();
		});
	});

	describe("getFunctionOrFail", () => {
		afterEach(() => {
			destroyFunction("Test");
		});

		it("should never create a new function", () => {
			expect(() => getFunctionOrFail("Test")).to.throw(
				"Function 'Test' was requested, but no such remote function exists.",
			);
		});

		it("should find a created function", () => {
			getFunction("Test");
			let fn;
			expect(() => {
				fn = getFunctionOrFail("Test");
			}).never.to.throw();
			expect(fn).to.be.ok();
		});

		it("should find an injected function", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteFunction");
			instance.Name = "Test";
			instance.Parent = module;
			let fn;
			expect(() => {
				fn = getFunctionOrFail("Test");
			}).never.to.throw();
			expect(fn).to.equal(instance);
		});

		it("should find the same function each time", () => {
			const fn = getFunction("Test");
			expect(getFunctionOrFail("Test")).to.equal(fn);
			expect(getFunctionOrFail("Test")).to.equal(fn);
		});

		it("should fail when finding a non-function", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteEvent");
			instance.Name = "Test";
			instance.Parent = module;
			expect(() => getFunctionOrFail("Test")).to.throw(
				"Function 'Test' was requested, but was not a remote function.",
			);
			instance.Destroy();
		});
	});

	describe("waitForFunction", () => {
		afterEach(() => {
			destroyFunction("Test");
		});

		it("should never create a new function", () => {
			expect(waitForFunction("Test", 0.1)).never.to.be.ok();
		});

		it("should find a created function", () => {
			getFunction("Test");
			expect(waitForFunction("Test")).to.be.ok();
		});

		it("should find an injected function", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteFunction");
			instance.Name = "Test";
			instance.Parent = module;
			expect(waitForFunction("Test")).to.equal(instance);
		});

		it("should find the same function each time", () => {
			const fn = getFunction("Test");
			expect(waitForFunction("Test")).to.equal(fn);
			expect(waitForFunction("Test")).to.equal(fn);
		});

		it("should fail when finding a non-function", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			const instance = new Instance("RemoteEvent");
			instance.Name = "Test";
			instance.Parent = module;
			expect(() => waitForFunction("Test")).to.throw(
				"Function 'Test' was requested, but was not a remote function.",
			);
			instance.Destroy();
		});

		it("should wait for a function", () => {
			task.spawn(() => {
				task.wait();
				getFunction("Test");
			});
			expect(() => getFunctionOrFail("Test")).to.throw();
			expect(waitForFunction("Test")).to.be.ok();
		});
	});

	describe("destroyFunction", () => {
		it("should allow destroy attempts on functions that don't exist", () => {
			expect(() => {
				destroyFunction("Test");
			}).never.to.throw();
		});

		it("should no longer find the function", () => {
			expect(getFunction("Test")).to.be.ok();
			destroyFunction("Test");
			expect(() => getFunctionOrFail("Test")).to.throw();
		});

		it("should destroy the remote function in the data model", () => {
			const module = script.Parent?.FindFirstChild("remotes");
			getFunction("Test");
			expect(module?.FindFirstChild("Test")).to.be.ok();
			destroyFunction("Test");
			expect(module?.FindFirstChild("Test")).never.to.be.ok();
		});
	});
};
