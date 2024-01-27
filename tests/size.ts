import test from "tape";
import { size } from "../src";

test("size", (t) => {
  t.plan(5);

  t.equal(size({}), 0);

  t.equal(
    size({
      a: { a: 1, b: 0 },
      b: { a: 0, b: 0 },
    }),
    1,
  );

  t.equal(
    size({
      a: { a: 3, b: 0, c: 0 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 1, b: 0, c: 0 },
    }),
    2,
  );

  t.equal(
    size(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 1, b: 0, c: 1 },
        c: { a: 0, b: 1, c: 0 },
      },
      { undirected: true },
    ),
    2,
    "Undirected",
  );

  t.throws(() => {
    size(
      {
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      },
      { undirected: true },
    );
  }, "Using the undirected option on a directed graph should throw an error");
});
