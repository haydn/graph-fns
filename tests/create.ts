import { create } from "../src";
import test from "tape";

test("create", (t) => {
  t.plan(2);

  t.deepEqual(create([]), {}, "Base case");

  t.deepEqual(
    create(["a", "b"]),
    {
      a: { a: 0, b: 0 },
      b: { a: 0, b: 0 },
    },
    "Custom IDs are provided",
  );
});
