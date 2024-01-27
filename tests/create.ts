import { create } from "../src";
import test from "tape";

test("create", (t) => {
  t.plan(1);

  t.deepEqual(
    create(2, (i) => `${i}!`),
    {
      "0!": { "0!": 0, "1!": 0 },
      "1!": { "0!": 0, "1!": 0 },
    },
    "Custom ID function is used",
  );
});
