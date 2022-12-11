import * as rootTree from "./rootTree.json";

type Node = { [key: string]: Node };

type RootNode = {
	[key in keyof Services]?: Node;
};

function getRoots(node: Node, parent: Instance): Instance[] {
	const roots: Instance[] = [];
	for (const [key, subNode] of pairs(node)) {
		const subRoots = getRoots(
			subNode,
			parent.FindFirstChild(key) ?? error(`Could not find child ${key}`),
		);
		subRoots.move(0, subRoots.size(), roots.size(), roots);
	}
	if (roots.isEmpty()) {
		roots.push(parent);
	}
	return roots;
}

function getAllRoots(node: RootNode): Instance[] {
	const roots: Instance[] = [];
	for (const [key, subNode] of pairs(node)) {
		const subRoots = getRoots(subNode, game.GetService(key));
		subRoots.move(0, subRoots.size(), roots.size(), roots);
	}
	return roots;
}

export const roots = getAllRoots(rootTree);
