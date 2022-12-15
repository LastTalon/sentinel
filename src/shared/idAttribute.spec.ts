/// <reference types="@rbxts/testez/globals" />
import {
	clientIdAttribute,
	Environment,
	getIdAttribute,
	serverIdAttribute,
	setEnvironment,
	unknownIdAttribute,
} from "./idAttribute";

export = (): void => {
	describe("unknownIdAttribute", () => {
		it("should be 'unknownEntityId'", () => {
			expect(unknownIdAttribute).to.equal("unknownEntityId");
		});
	});

	describe("serverIdAttribute", () => {
		it("should be 'serverEntityId'", () => {
			expect(serverIdAttribute).to.equal("serverEntityId");
		});
	});

	describe("clientIdAttribute", () => {
		it("should be 'clientEntityId'", () => {
			expect(clientIdAttribute).to.equal("clientEntityId");
		});
	});

	describe("setEnvironment", () => {
		it("should set the ID attribute to the server attribute", () => {
			setEnvironment(Environment.Server);
			expect(getIdAttribute()).to.equal(serverIdAttribute);
		});

		it("should set the ID attribute to the client attribute", () => {
			setEnvironment(Environment.Client);
			expect(getIdAttribute()).to.equal(clientIdAttribute);
		});

		it("should set the ID attribute to the unknown attribute", () => {
			setEnvironment(Environment.Unknown);
			expect(getIdAttribute()).to.equal(unknownIdAttribute);
		});
	});
};
