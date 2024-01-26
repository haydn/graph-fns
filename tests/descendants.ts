import test from "tape";
import { descendants } from "..";

test("descendants", (t) => {
  t.plan(3);

  t.deepEqual(
    descendants(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 0, b: 0, c: 1 },
        c: { a: 0, b: 0, c: 0 },
      },
      "a",
    ),
    new Set(["b", "c"]),
  );

  t.deepEqual(
    descendants(
      {
        a: { a: 0, b: 1, c: 0, d: 0 },
        b: { a: 0, b: 0, c: 1, d: 1 },
        c: { a: 0, b: 0, c: 0, d: 1 },
        d: { a: 0, b: 0, c: 0, d: 0 },
      },
      "a",
    ),
    new Set(["b", "c", "d"]),
  );

  t.throws(() => {
    descendants(
      {
        a: { a: 0, b: 1 },
        b: { a: 1, b: 0 },
      },
      "a",
    );
  }, "A graph with cycles should throw an error");
});
