import test from "tape";
import { clone } from "../src";

test("clone", (t) => {
  t.plan(4);

  const original = {
    a: { a: 0, b: 1 },
    b: { a: 0, b: 0 },
  };

  t.deepEqual(
    clone(original),
    original,
    "Cloning should return a graph exactly equal to the original graph",
  );

  t.notEqual(clone(original), original, "Cloning should make a copy of the graph");
  t.notEqual(clone(original).a, original.a, "Cloning should make a copy of the graph");
  t.notEqual(clone(original).b, original.b, "Cloning should make a copy of the graph");
});
