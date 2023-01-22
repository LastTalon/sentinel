/**
 * The Model component archetype.
 *
 * Provides a reference to the {@link PVInstance} that represents the attached
 * entity.
 */
export interface Model {
	model?: PVInstance;
}

/**
 * The Transform component archetype.
 *
 * Provides a reference {@link CFrame} that represents the world transform of
 * the attached entity.
 */
export interface Transform {
	cframe: CFrame;
	_doNotReconcile?: true;
}
