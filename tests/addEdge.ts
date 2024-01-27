import test from "tape";
import { addEdge } from "../src";

test("addEdge", (t) => {
  t.plan(3);

  t.deepEqual(
    addEdge(
      {
        a: { a: 0, b: 0 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
    ),
    {
      a: { a: 0, b: 1 },
      b: { a: 0, b: 0 },
    },
    "Base case",
  );

  t.deepEqual(
    addEdge(
      {
        a: { a: 0, b: 1.5 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
    ),
    {
      a: { a: 0, b: 1.5 },
      b: { a: 0, b: 0 },
    },
    "Adding an edge that already exists should be a no-op",
  );

  t.deepEqual(
    addEdge(
      {
        a: { a: 0, b: 0 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
      { undirected: true },
    ),
    {
      a: { a: 0, b: 1 },
      b: { a: 1, b: 0 },
    },
    "Add undirected edge",
  );
});
