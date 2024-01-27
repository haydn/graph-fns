import { addVertex } from "../src";
import test from "tape";

test("addVertex", (t) => {
  t.plan(3);

  t.deepEqual(
    addVertex({}, "a"),
    {
      a: { a: 0 },
    },
    "Base case",
  );

  t.deepEqual(
    addVertex(
      {
        a: { a: 0 },
      },
      "b",
    ),
    {
      a: { a: 0, b: 0 },
      b: { a: 0, b: 0 },
    },
    "Adding a vertex to an existing graph should create empty rows and columns",
  );

  t.deepEqual(
    addVertex(
      {
        a: { a: 0 },
      },
      "a",
    ),
    {
      a: { a: 0 },
    },
    "Adding a vertex that already exists should be a no-op",
  );
});
