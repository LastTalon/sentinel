import { GamePlacement, Movement, Transform } from "./types";

/**
 * The default value created when no data is provided to a {@link Transform}
 * component.
 */
export const transform: Transform = {
	cframe: CFrame.identity,
};

/**
 * The default value created when no data is provided to a {@link Movement}
 * component.
 */
export const movement: Movement = {
	// ~2.6 meters per second is a typical human run speed
	maxSpeed: 2.6,
	// Turning halfway around in one second, seems reasonable as a default
	// starting point.
	maxAngularSpeed: math.pi,
	velocity: Vector2.zero,
	angularVelocity: 0,
};

/**
 * The default value created when no data is provided to a {@link GamePlacement}
 * component.
 */
export const gamePlacement: GamePlacement = {
	position: Vector2.zero,
	orientation: 0,
	respectsGeometry: false,
	offsetHeight: 0,
};
