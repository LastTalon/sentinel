import { Host } from "shared/hosts";

/**
 * A string that represents the default ID attribute when the environment is
 * not client or server.
 */
export const unknownIdAttribute = "unknownEntityId";

/**
 * A string that represents the ID attribute when the environment is the server.
 */
export const serverIdAttribute = "serverEntityId";

/**
 * A string that represents the ID attribute when the environment is the client.
 */
export const clientIdAttribute = "clientEntityId";

let idAttribute = unknownIdAttribute;

/**
 * Gets a string that represents the current ID attribute being used. This value
 * defaults to {@link unknownIdAttribute}.
 *
 * @return the ID attribute
 */
export function getIdAttribute(): string {
	return idAttribute;
}

/**
 * Sets the `idAttribute` variable based on the provided environment.
 *
 * @param environment - The environment to set the ID attribute for
 */
export function setEnvironment(environment: Host): void {
	switch (environment) {
		case Host.Server:
			idAttribute = serverIdAttribute;
			break;
		case Host.Client:
			idAttribute = clientIdAttribute;
			break;
		default:
			idAttribute = unknownIdAttribute;
	}
}
