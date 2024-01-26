import test from "tape";
import { ancestors } from "..";

test("ancestors", (t) => {
  t.plan(3);

  t.deepEqual(
    ancestors(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 0, b: 0, c: 1 },
        c: { a: 0, b: 0, c: 0 },
      },
      "c",
    ),
    new Set(["a", "b"]),
  );

  t.deepEqual(
    ancestors(
      {
        a: { a: 0, b: 1, c: 0, d: 0 },
        b: { a: 0, b: 0, c: 1, d: 1 },
        c: { a: 0, b: 0, c: 0, d: 1 },
        d: { a: 0, b: 0, c: 0, d: 0 },
      },
      "d",
    ),
    new Set(["a", "b", "c"]),
  );

  t.throws(() => {
    ancestors(
      {
        a: { a: 0, b: 1 },
        b: { a: 1, b: 0 },
      },
      "b",
    );
  }, "Graphs with cycles should throw an error");
});
