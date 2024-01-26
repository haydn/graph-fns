import test from "tape";
import { makeUndirected } from "..";

test("makeUndirected", (t) => {
  t.plan(5);

  t.deepEqual(makeUndirected({}), {});

  t.deepEqual(makeUndirected({ a: { a: 1 } }), { a: { a: 1 } });

  t.deepEqual(
    makeUndirected({
      a: { a: 1, b: 1, c: 0 },
      b: { a: 0, b: 0, c: 1 },
      c: { a: 0, b: 0, c: 0 },
    }),
    {
      a: { a: 1, b: 1, c: 0 },
      b: { a: 1, b: 0, c: 1 },
      c: { a: 0, b: 1, c: 0 },
    },
  );

  t.deepEqual(
    makeUndirected({
      a: { a: 0.5, b: -1, c: 0 },
      b: { a: 0, b: 0, c: -1 },
      c: { a: 0, b: 0, c: 0 },
    }),
    {
      a: { a: 0.5, b: -1, c: 0 },
      b: { a: -1, b: 0, c: -1 },
      c: { a: 0, b: -1, c: 0 },
    },
  );

  t.deepEqual(
    makeUndirected(
      {
        a: { a: 2, b: 3, c: 0 },
        b: { a: 2, b: 0, c: 1 },
        c: { a: 0, b: 0, c: 0 },
      },
      (a, b) => a * b,
    ),
    {
      a: { a: 2, b: 6, c: 0 },
      b: { a: 6, b: 0, c: 1 },
      c: { a: 0, b: 1, c: 0 },
    },
  );
});
