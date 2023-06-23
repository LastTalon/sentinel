/**
 * The Model component.
 *
 * Provides a reference to the {@link PVInstance} that represents the attached
 * entity.
 */
export interface Model {
	model?: PVInstance;
}

/**
 * The Transform component.
 *
 * Provides a reference {@link CFrame} that represents the world transform of
 * the attached entity.
 */
export interface Transform {
	cframe: CFrame;
	_doNotReconcile?: true;
}

/**
 * The Health component.
 *
 * Holds health information including health reduction and regeneration.
 */
export interface Health {
	health: number;
	maxHealth: number;
	regeneration: number;
	armor: number;
	block: number;
	evasion: number;
}

/**
 * The Damage component.
 *
 * Holds health-reduction information.
 */
export interface Damage {
	damage: number;
}

/**
 * The Movement component.
 *
 * Contains information about where a character intends to move.
 */
export interface Movement {
	maxSpeed: number;
	maxAngularSpeed: number;
	velocity: Vector2;
	angularVelocity: number;
}

/**
 * The GamePlacement component.
 *
 * Contains derived information about where something is located in the context
 * of the game space.
 *
 * This is distinct from a Transform, because it does not necessarily correlate
 * to world space, although it often will be translated to a Transform for
 * placing it in the world.
 */
export interface GamePlacement {
	position: Vector2;
	orientation: number;
	respectsGeometry: boolean;
	offsetHeight: number;
}

export interface HipHeight {
	height: number;
}

export interface TravelHeight {
	height: number;
}
