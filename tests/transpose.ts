import test from "tape";
import { transpose } from "../src";

test("transpose", (t) => {
  t.plan(5);

  t.deepEqual(
    transpose({
      a: { a: 0 },
    }),
    {
      a: { a: 0 },
    },
  );

  t.deepEqual(
    transpose({
      a: { a: 0, b: 1 },
      b: { a: 0, b: 0 },
    }),
    {
      a: { a: 0, b: 0 },
      b: { a: 1, b: 0 },
    },
  );

  t.deepEqual(
    transpose({
      a: { a: 0, b: -0.5 },
      b: { a: 0, b: 0 },
    }),
    {
      a: { a: 0, b: 0 },
      b: { a: -0.5, b: 0 },
    },
  );

  t.deepEqual(
    transpose({
      a: { a: 0, b: 1, c: 1 },
      b: { a: 0, b: 0, c: 1 },
      c: { a: 0, b: 0, c: 0 },
    }),
    {
      a: { a: 0, b: 0, c: 0 },
      b: { a: 1, b: 0, c: 0 },
      c: { a: 1, b: 1, c: 0 },
    },
  );

  t.deepEqual(
    transpose({
      a: { a: 1, b: 1, c: 1 },
      b: { a: 1, b: 1, c: 1 },
      c: { a: 1, b: 1, c: 1 },
    }),
    {
      a: { a: 1, b: 1, c: 1 },
      b: { a: 1, b: 1, c: 1 },
      c: { a: 1, b: 1, c: 1 },
    },
  );
});
