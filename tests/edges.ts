import test from "tape";
import { edges } from "..";

test("edges", (t) => {
  t.plan(4);

  t.deepEqual(
    edges({
      a: { a: 0, b: 1, c: 0 },
      b: { a: 0, b: 0, c: 1 },
      c: { a: 0, b: 0, c: 0 },
    }),
    new Set([
      ["a", "b"],
      ["b", "c"],
    ]),
  );

  t.deepEqual(
    edges({
      a: { a: 0, b: 2, c: 0 },
      b: { a: 0, b: 0, c: 1 },
      c: { a: 0.5, b: 0, c: 0 },
    }),
    new Set([
      ["a", "b"],
      ["b", "c"],
      ["c", "a"],
    ]),
  );

  t.deepEqual(
    edges(
      {
        a: { a: 1, b: 1, c: 0 },
        b: { a: 1, b: 0, c: 1 },
        c: { a: 0, b: 1, c: 0 },
      },
      { undirected: true },
    ),
    new Set([
      ["a", "a"],
      ["a", "b"],
      ["b", "c"],
    ]),
    "Undirected mode",
  );

  t.throws(() => {
    edges(
      {
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      },
      { undirected: true },
    );
  }, "Using the undirected option on a directed graph should throw an error");
});
