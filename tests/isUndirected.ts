import test from "tape";
import { isUndirected } from "..";

test("isUndirected", (t) => {
  t.plan(4);

  t.equal(isUndirected({}), true);

  t.equal(isUndirected({ a: { a: 1 } }), true);

  t.equal(
    isUndirected({
      a: { a: 1, b: 1 },
      b: { a: 0, b: 0 },
    }),
    false,
  );

  t.equal(
    isUndirected({
      a: { a: 0, b: 1 },
      b: { a: 1, b: 0 },
    }),
    true,
  );
});
