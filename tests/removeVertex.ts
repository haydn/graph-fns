import test from "tape";
import { removeVertex } from "../src";

test("removeVertex", (t) => {
  t.plan(1);

  t.deepEqual(
    removeVertex(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 0, b: 0, c: 1 },
        c: { a: 1, b: 0, c: 0 },
      },
      "b",
    ),
    {
      a: { a: 0, c: 0 },
      c: { a: 1, c: 0 },
    },
  );
});
