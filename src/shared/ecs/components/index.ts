import { Component, component } from "@rbxts/matter";
import { transform } from "./defaults";
import type { Model as ModelComponent, Transform as TransformComponent } from "./types";

export type SentinelComponentType = ModelComponent | TransformComponent;
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
 * This is a test component constructor.
 *
 * It shouldn't be used and should be removed at some point.
 */
export const Test = component("Test");
