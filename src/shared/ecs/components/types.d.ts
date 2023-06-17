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
