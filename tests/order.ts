import test from "tape";
import { order } from "../src";

test("order", (t) => {
  t.plan(3);

  t.equal(order({}), 0);

  t.equal(
    order({
      a: { a: 0 },
    }),
    1,
  );

  t.equal(
    order({
      a: { a: 0, b: 0 },
      b: { a: 0, b: 0 },
    }),
    2,
  );
});
