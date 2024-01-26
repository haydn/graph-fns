import test from "tape";
import { topologicalSort } from "..";

test("topologicalSort", (t) => {
  t.plan(6);

  t.deepEqual(
    topologicalSort({
      a: { a: 0 },
    }),
    ["a"],
  );

  t.deepEqual(
    topologicalSort({
      a: { a: 0, b: 0, c: 0 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    }),
    ["a", "b", "c"],
  );

  t.deepEqual(
    topologicalSort({
      a: { a: 0, b: 1, c: 0 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 1, b: 0, c: 0 },
    }),
    ["c", "a", "b"],
  );

  t.deepEqual(
    topologicalSort({
      a: { a: 0, b: 0, c: 0 },
      b: { a: 1, b: 0, c: 0 },
      c: { a: 1, b: 0, c: 0 },
    }),
    ["b", "c", "a"],
  );

  t.deepEqual(
    topologicalSort({
      a: { a: 0, b: 0 },
      b: { a: 10, b: 0 },
    }),
    ["b", "a"],
  );

  t.throws(() => {
    topologicalSort({
      a: { a: 0, b: 1 },
      b: { a: 1, b: 0 },
    });
  });
});
