/// <reference types="@rbxts/testez/globals" />
import { Host } from "shared/hosts";
import {
	clientIdAttribute,
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
			setEnvironment(Host.Server);
			expect(getIdAttribute()).to.equal(serverIdAttribute);
		});

		it("should set the ID attribute to the client attribute", () => {
			setEnvironment(Host.Client);
			expect(getIdAttribute()).to.equal(clientIdAttribute);
		});

		it("should set the ID attribute to the unknown attribute", () => {
			setEnvironment(Host.None);
			expect(getIdAttribute()).to.equal(unknownIdAttribute);
			setEnvironment(Host.All);
			expect(getIdAttribute()).to.equal(unknownIdAttribute);
		});
	});
};
