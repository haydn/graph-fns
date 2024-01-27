import test from "tape";
import { setEdge } from "../src";

test("setEdge", (t) => {
  t.plan(4);

  t.deepEqual(
    setEdge(
      {
        a: { a: 0, b: 0 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
      1,
    ),
    {
      a: { a: 0, b: 1 },
      b: { a: 0, b: 0 },
    },
  );

  t.deepEqual(
    setEdge(
      {
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
      0,
    ),
    {
      a: { a: 0, b: 0 },
      b: { a: 0, b: 0 },
    },
  );

  t.deepEqual(
    setEdge(
      {
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
      1.5,
    ),
    {
      a: { a: 0, b: 1.5 },
      b: { a: 0, b: 0 },
    },
  );

  t.deepEqual(
    setEdge(
      {
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
      1.5,
      { undirected: true },
    ),
    {
      a: { a: 0, b: 1.5 },
      b: { a: 1.5, b: 0 },
    },
    "Undirected",
  );
});
