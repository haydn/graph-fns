import test from "tape";
import { parents } from "..";

test("parents", (t) => {
  t.plan(2);

  t.deepEqual(
    parents(
      {
        a: { a: 0, b: 0, c: 1 },
        b: { a: 0, b: 0, c: 0.5 },
        c: { a: 0, b: 0, c: 0 },
      },
      "c",
    ),
    new Set(["a", "b"]),
  );

  t.deepEqual(
    parents(
      {
        a: { a: 1 },
      },
      "a",
    ),
    new Set(["a"]),
  );
});
