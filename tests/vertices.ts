import test from "tape";
import { vertices } from "..";

test("vertices", (t) => {
  t.plan(1);

  t.deepEqual(
    vertices({
      a: { a: 0, b: 0, c: 0 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    }),
    new Set(["a", "b", "c"]),
  );
});
