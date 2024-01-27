import test from "tape";
import { toD3 } from "../src";

test("toD3", (t) => {
  t.plan(3);

  t.deepEqual(
    toD3({
      a: { a: 1, b: 2, c: 0.5 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    }),
    {
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      links: [
        { source: "a", target: "a" },
        { source: "a", target: "b" },
        { source: "a", target: "b" },
        { source: "a", target: "c" },
      ],
    },
  );

  t.deepEqual(
    toD3(
      {
        a: { a: 0, b: 1, c: 1 },
        b: { a: 1, b: 0, c: 0 },
        c: { a: 1, b: 0, c: 0 },
      },
      { undirected: true },
    ),
    {
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      links: [
        { source: "a", target: "b" },
        { source: "a", target: "c" },
      ],
    },
  );

  t.throws(() => {
    toD3(
      {
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      },
      { undirected: true },
    );
  }, "Using the undirected option on a directed graph should throw an error");
});
