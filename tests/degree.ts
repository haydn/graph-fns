import test from "tape";
import { degree } from "..";

test("degree", (t) => {
  t.plan(7);

  t.equal(degree({ a: { a: 0 } }, "a"), 0, "Base case");

  t.equal(
    degree(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 2, b: 0, c: 0 },
        c: { a: -0.5, b: 0, c: 0 },
      },
      "a",
    ),
    3,
    "The unweighted degree should be the count of edges",
  );

  t.equal(
    degree(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 2, b: 0, c: 0 },
        c: { a: -0.5, b: 0, c: 0 },
      },
      "a",
      { weighted: true },
    ),
    2.5,
    "The weighted degree should be the sum of edge weights",
  );

  t.equal(
    degree(
      {
        a: { a: 1.5 },
      },
      "a",
    ),
    2,
    "Loops should count twice towards the degree",
  );

  t.equal(
    degree(
      {
        a: { a: 1.5 },
      },
      "a",
      { weighted: true },
    ),
    3,
    "Loops should count twice towards the weighted degree",
  );

  t.equal(
    degree(
      {
        a: { a: 0, b: 1, c: 1 },
        b: { a: 1, b: 0, c: 0 },
        c: { a: 1, b: 0, c: 0 },
      },
      "a",
      { undirected: true },
    ),
    2,
    "Reciprocal edges should only be counted once in undirected mode",
  );

  t.throws(() => {
    degree(
      {
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      },
      "a",
      { undirected: true },
    );
  }, "Using the undirected option on a directed graph should throw an error");
});
