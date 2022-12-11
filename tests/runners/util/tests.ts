import { TestBootstrap } from "@rbxts/testez";

export function test(
	roots: Instance[],
): LuaTuple<[completed: true, result: boolean] | [completed: false, error: string]> {
	print();
	const call = xpcall(
		() => {
			const results = TestBootstrap.run(roots);
			return results.failureCount === 0;
		},
		(err) => debug.traceback(tostring(err)),
	);
	print();
	return call;
}
