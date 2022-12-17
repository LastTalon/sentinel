import { component } from "@rbxts/matter";
import { Model as ModelArchetype } from "./archetypes";
import { transform } from "./defaults";

export const Model = component<ModelArchetype>("Model");
export const Transform = component("Transform", transform);
export const Test = component("Test");
