import test from "tape";
import { getEdge } from "..";

test("getEdge", (t) => {
  t.plan(1);

  t.equal(
    getEdge(
      {
        a: { a: 0, b: 1.5 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
    ),
    1.5,
  );
});
