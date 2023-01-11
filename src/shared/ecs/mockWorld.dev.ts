import { AnyEntity, Entity, World } from "@rbxts/matter";
import { ComponentBundle, DynamicBundle } from "@rbxts/matter/lib/component";

export interface EntityEntry {
	insert: ComponentBundle;
	remove: DynamicBundle;
}

export interface MockWorld extends World {
	entities: EntityEntry[];
}

export function mockWorld(): MockWorld {
	const world = new World() as unknown as MockWorld;
	world.entities = [];

	world.spawn = (<T extends ComponentBundle>(_: never, ...components: T): Entity<T> => {
		const id = world.entities.size();
		world.entities.push({
			insert: components,
			remove: [],
		});
		return id as Entity<T>;
	}) as <T extends ComponentBundle>(...components: T) => Entity<T>;

	world.despawn = ((_: never, id: AnyEntity): void => {
		delete world.entities[id];
	}) as (id: AnyEntity) => void;

	world.insert = ((_: never, id: AnyEntity, ...components: ComponentBundle): void => {
		const entity = world.entities[id];
		components.move(0, components.size(), entity.insert.size(), entity.insert);
	}) as unknown as (id: AnyEntity, ...components: ComponentBundle) => void;

	world.remove = (<T extends DynamicBundle>(_: never, id: AnyEntity, ...components: T): T => {
		const entity = world.entities[id];
		components.move(0, components.size(), entity.remove.size(), entity.remove);
		return components;
	}) as <T extends DynamicBundle>(id: AnyEntity, ...components: T) => T;

	return world;
}
