import test from "tape";
import { indegree } from "..";

test("indegree", (t) => {
  t.plan(2);

  t.equal(
    indegree(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 2, b: 0, c: 0 },
        c: { a: 0.5, b: 0, c: 0 },
      },
      "a",
    ),
    2,
  );

  t.equal(
    indegree(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 2, b: 0, c: 0 },
        c: { a: 0.5, b: 0, c: 0 },
      },
      "a",
      { weighted: true },
    ),
    2.5,
  );
});
