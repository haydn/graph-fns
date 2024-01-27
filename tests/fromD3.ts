import test from "tape";
import { fromD3 } from "../src";

test("fromD3", (t) => {
  t.plan(2);

  t.deepEqual(
    fromD3({
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      links: [
        { source: "a", target: "b" },
        { source: "a", target: "c" },
        { source: "a", target: "a" },
      ],
    }),
    {
      a: { a: 1, b: 1, c: 1 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    },
  );

  t.deepEqual(
    fromD3(
      {
        nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
        links: [
          { source: "a", target: "a" },
          { source: "a", target: "b" },
          { source: "a", target: "c" },
        ],
      },
      { undirected: true },
    ),
    {
      a: { a: 1, b: 1, c: 1 },
      b: { a: 1, b: 0, c: 0 },
      c: { a: 1, b: 0, c: 0 },
    },
  );
});
