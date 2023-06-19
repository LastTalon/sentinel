import { Component, component } from "@rbxts/matter";
import { gamePlacement, movement, transform } from "./defaults";
import type {
	Damage as DamageComponent,
	GamePlacement as GamePlacementComponent,
	Health as HealthComponent,
	Model as ModelComponent,
	Movement as MovementComponent,
	Transform as TransformComponent,
} from "./types";

export type SentinelComponentType =
	| ModelComponent
	| TransformComponent
	| HealthComponent
	| DamageComponent
	| GamePlacementComponent
	| MovementComponent;
export type SentinelComponent = Component<SentinelComponentType>;

/**
 * The {@link ModelComponent | Model} component constructor.
 */
export const Model = component<ModelComponent>("Model");

/**
 * The {@link TransformComponent | Transform} component constructor.
 */
export const Transform = component<TransformComponent>("Transform", transform);

/**
 * The {@link HealthComponent | Health} component constructor.
 */
export const Health = component<HealthComponent>("Health");

/**
 * The {@link DamageComponent | Damage} component constructor.
 */
export const Damage = component<DamageComponent>("Damage");

/**
 * The {@link MovementComponent | Movement} component constructor.
 */
export const Movement = component<MovementComponent>("Movement", movement);

/**
 * The {@link GamePlacementComponent | GamePlacement} component constructor.
 */
export const GamePlacement = component<GamePlacementComponent>("GamePlacement", gamePlacement);

/**
 * This is a test component constructor.
 *
 * It shouldn't be used and should be removed at some point.
 */
export const Test = component("Test");
