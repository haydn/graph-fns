import test from "tape";
import { removeEdge } from "..";

test("removeEdge", (t) => {
  t.plan(3);

  t.deepEqual(
    removeEdge(
      {
        a: { a: 0, b: 1.5, c: 0 },
        b: { a: 0, b: 0, c: 0.5 },
        c: { a: 2, b: 0, c: 0 },
      },
      ["a", "b"],
    ),
    {
      a: { a: 0, b: 0, c: 0 },
      b: { a: 0, b: 0, c: 0.5 },
      c: { a: 2, b: 0, c: 0 },
    },
  );

  t.deepEqual(
    removeEdge(
      {
        a: { a: 0, b: 2 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
    ),
    {
      a: { a: 0, b: 0 },
      b: { a: 0, b: 0 },
    },
  );

  t.deepEqual(
    removeEdge(
      {
        a: { a: 0, b: 1 },
        b: { a: 1, b: 0 },
      },
      ["a", "b"],
      { undirected: true },
    ),
    {
      a: { a: 0, b: 0 },
      b: { a: 0, b: 0 },
    },
    "Undirected",
  );
});
