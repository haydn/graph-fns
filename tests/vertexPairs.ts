import test from "tape";
import { vertexPairs } from "..";

test("vertexPairs", (t) => {
  t.plan(1);

  t.deepEqual(
    vertexPairs({
      a: { a: 0, b: 0, c: 0 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    }),
    new Set([
      ["a", "a"],
      ["a", "b"],
      ["a", "c"],
      ["b", "b"],
      ["b", "c"],
      ["c", "c"],
    ]),
  );
});
