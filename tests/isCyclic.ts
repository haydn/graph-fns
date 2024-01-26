import test from "tape";
import { isCyclic } from "..";

test("isCyclic", (t) => {
  t.test("directed graph", (t) => {
    t.plan(9);

    t.equal(isCyclic({}), false);

    t.equal(
      isCyclic({
        a: { a: 0 },
      }),
      false,
    );

    t.equal(
      isCyclic({
        a: { a: 0, b: 0 },
        b: { a: 0, b: 0 },
      }),
      false,
    );

    t.equal(
      isCyclic({
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      }),
      false,
    );

    t.equal(
      isCyclic({
        a: { a: 0, b: 1, c: 1 },
        b: { a: 0, b: 0, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      }),
      false,
    );

    t.equal(
      isCyclic({
        a: { a: 1 },
      }),
      true,
    );

    t.equal(
      isCyclic({
        a: { a: 0, b: 1 },
        b: { a: 1, b: 0 },
      }),
      true,
    );

    t.equal(
      isCyclic({
        a: { a: 0, b: 1, c: 0 },
        b: { a: 0, b: 0, c: 1 },
        c: { a: 1, b: 0, c: 0 },
      }),
      true,
    );

    t.equal(
      isCyclic({
        a: { a: 1, b: 0 },
        b: { a: 0, b: 1 },
      }),
      true,
    );
  });

  t.test("undirected graph", (t) => {
    t.plan(5);

    t.equal(isCyclic({}, { undirected: true }), false, "Base case");

    t.equal(
      isCyclic(
        {
          a: { a: 0, b: 1 },
          b: { a: 1, b: 0 },
        },
        { undirected: true },
      ),
      false,
      "Single edge",
    );

    t.equal(
      isCyclic(
        {
          a: { a: 0, b: 1, c: 0 },
          b: { a: 1, b: 0, c: 1 },
          c: { a: 0, b: 1, c: 0 },
        },
        { undirected: true },
      ),
      false,
      "2 edge graph",
    );

    t.equal(
      isCyclic(
        {
          a: { a: 0, b: 1, c: 1 },
          b: { a: 1, b: 0, c: 1 },
          c: { a: 1, b: 1, c: 0 },
        },
        { undirected: true },
      ),
      true,
      "Complete graph",
    );

    t.throws(() => {
      isCyclic(
        {
          a: { a: 0, b: 1 },
          b: { a: 0, b: 0 },
        },
        { undirected: true },
      );
    }, "Using the undirected option on a directed graph should throw an error");
  });
});
