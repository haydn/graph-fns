import test from "tape";
import { children } from "../src";

test("children", (t) => {
  t.plan(2);

  t.deepEqual(
    children(
      {
        a: { a: 0, b: 1, c: 1 },
        b: { a: 0, b: 0, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
      "a",
    ),
    new Set(["b", "c"]),
  );

  t.deepEqual(
    children(
      {
        a: { a: 1 },
      },
      "a",
    ),
    new Set(["a"]),
    "Loops should cause the vertex to be listed as a child of itself",
  );
});
