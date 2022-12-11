import { test } from "./util/tests";
import { roots } from "./util/roots";

const [completed, result] = test(roots);

if (completed) {
	if (!result) {
		error("Tests have failed.", 0);
	}
} else {
	error(result, 0);
}
