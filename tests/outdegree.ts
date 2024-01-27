import test from "tape";
import { outdegree } from "../src";

test("outdegree", (t) => {
  t.plan(2);

  t.equal(
    outdegree(
      {
        a: { a: 0, b: 2, c: 0.5 },
        b: { a: 1, b: 0, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
      "a",
    ),
    2,
  );

  t.equal(
    outdegree(
      {
        a: { a: 0, b: 2, c: 0.5 },
        b: { a: 1, b: 0, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
      "a",
      { weighted: true },
    ),
    2.5,
  );
});
