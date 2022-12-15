/**
 * A string that represents the default ID attribute when the environment is
 * unknown.
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
 * The possible environments entity id attributes can be set in.
 */
export enum Environment {
	Unknown,
	Server,
	Client,
}

/**
 * Sets the `idAttribute` variable based on the provided environment.
 *
 * @param environment - The environment to set the ID attribute for
 */
export function setEnvironment(environment: Environment): void {
	switch (environment) {
		case Environment.Server:
			idAttribute = serverIdAttribute;
			break;
		case Environment.Client:
			idAttribute = clientIdAttribute;
			break;
		default:
			idAttribute = unknownIdAttribute;
	}
}
