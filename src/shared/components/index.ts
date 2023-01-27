import { component } from "@rbxts/matter";
import { Model as ModelArchetype, Transform as TransformArchetype } from "./archetypes";
import { transform } from "./defaults";

/**
 * The {@link ModelArchetype | Model} component constructor.
 */
export const Model = component<ModelArchetype>("Model");

/**
 * The {@link TransformArchetype | Transform} component constructor.
 */
export const Transform = component<TransformArchetype>("Transform", transform);

/**
 * This is a test component constructor.
 *
 * It shouldn't be used and should be removed at some point.
 */
export const Test = component("Test");
