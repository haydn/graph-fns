import {
  addEdge,
  addVertex,
  create,
  fromD3,
  inDegrees,
  isCyclic,
  outDegrees,
  removeEdge,
  removeVertex,
  toD3,
  topologicalSort,
} from "./index";

import test from "tape";

test("addEdge", (t) => {
  t.plan(1);

  t.deepEqual(
    addEdge(
      {
        size: 2,
        adjacencyMatrix: {
          a: { a: 0, b: 0 },
          b: { a: 0, b: 0 },
        },
      },
      ["a", "b"]
    ),
    {
      size: 2,
      adjacencyMatrix: {
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      },
    }
  );
});

test("addVertex", (t) => {
  t.plan(2);

  t.deepEqual(
    addVertex(
      {
        size: 0,
        adjacencyMatrix: {},
      },
      "a"
    ),
    {
      size: 1,
      adjacencyMatrix: {
        a: { a: 0 },
      },
    }
  );

  t.deepEqual(
    addVertex(
      {
        size: 1,
        adjacencyMatrix: {
          a: { a: 0 },
        },
      },
      "b"
    ),
    {
      size: 2,
      adjacencyMatrix: {
        a: { a: 0, b: 0 },
        b: { a: 0, b: 0 },
      },
    }
  );
});

test("create", (t) => {
  t.plan(1);

  t.deepEqual(
    create(2, (i) => `${i}!`),
    {
      size: 2,
      adjacencyMatrix: {
        "0!": { "0!": 0, "1!": 0 },
        "1!": { "0!": 0, "1!": 0 },
      },
    }
  );
});

test("fromD3", (t) => {
  t.plan(1);

  t.deepEqual(
    fromD3({
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      links: [
        { source: "a", target: "b" },
        { source: "a", target: "c" },
        { source: "a", target: "a" },
      ],
    }),
    {
      size: 3,
      adjacencyMatrix: {
        a: { a: 1, b: 1, c: 1 },
        b: { a: 0, b: 0, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
    }
  );
});

test("inDegrees", (t) => {
  t.plan(1);

  t.deepEqual(
    inDegrees({
      size: 3,
      adjacencyMatrix: {
        a: { a: 1, b: 1, c: 1 },
        b: { a: 0, b: 1, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
    }),
    { a: 1, b: 2, c: 1 }
  );
});

test("isCyclic", (t) => {
  t.plan(8);

  t.equal(
    isCyclic({
      size: 1,
      adjacencyMatrix: {
        a: { a: 0 },
      },
    }),
    false
  );

  t.equal(
    isCyclic({
      size: 2,
      adjacencyMatrix: {
        a: { a: 0, b: 0 },
        b: { a: 0, b: 0 },
      },
    }),
    false
  );

  t.equal(
    isCyclic({
      size: 2,
      adjacencyMatrix: {
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      },
    }),
    false
  );

  t.equal(
    isCyclic({
      size: 3,
      adjacencyMatrix: {
        a: { a: 0, b: 1, c: 1 },
        b: { a: 0, b: 0, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
    }),
    false
  );

  t.equal(
    isCyclic({
      size: 1,
      adjacencyMatrix: {
        a: { a: 1 },
      },
    }),
    true
  );

  t.equal(
    isCyclic({
      size: 2,
      adjacencyMatrix: {
        a: { a: 0, b: 1 },
        b: { a: 1, b: 0 },
      },
    }),
    true
  );

  t.equal(
    isCyclic({
      size: 3,
      adjacencyMatrix: {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 0, b: 0, c: 1 },
        c: { a: 1, b: 0, c: 0 },
      },
    }),
    true
  );

  t.equal(
    isCyclic({
      size: 2,
      adjacencyMatrix: {
        a: { a: 1, b: 0 },
        b: { a: 0, b: 1 },
      },
    }),
    true
  );
});

test("outDegrees", (t) => {
  t.plan(1);

  t.deepEqual(
    outDegrees({
      size: 3,
      adjacencyMatrix: {
        a: { a: 1, b: 1, c: 1 },
        b: { a: 0, b: 1, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
    }),
    { a: 3, b: 1, c: 0 }
  );
});

test("removeEdge", (t) => {
  t.plan(1);

  t.deepEqual(
    removeEdge(
      {
        size: 3,
        adjacencyMatrix: {
          a: { a: 0, b: 1, c: 0 },
          b: { a: 0, b: 0, c: 1 },
          c: { a: 1, b: 0, c: 0 },
        },
      },
      ["a", "b"]
    ),
    {
      size: 3,
      adjacencyMatrix: {
        a: { a: 0, b: 0, c: 0 },
        b: { a: 0, b: 0, c: 1 },
        c: { a: 1, b: 0, c: 0 },
      },
    }
  );
});

test("removeVertex", (t) => {
  t.plan(1);

  t.deepEqual(
    removeVertex(
      {
        size: 3,
        adjacencyMatrix: {
          a: { a: 0, b: 1, c: 0 },
          b: { a: 0, b: 0, c: 1 },
          c: { a: 1, b: 0, c: 0 },
        },
      },
      "b"
    ),
    {
      size: 2,
      adjacencyMatrix: {
        a: { a: 0, c: 0 },
        c: { a: 1, c: 0 },
      },
    }
  );
});

test("toD3", (t) => {
  t.plan(1);
  t.deepEqual(
    toD3({
      size: 3,
      adjacencyMatrix: {
        a: { a: 1, b: 1, c: 1 },
        b: { a: 0, b: 0, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
    }),
    {
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      links: [
        { source: "a", target: "a" },
        { source: "a", target: "b" },
        { source: "a", target: "c" },
      ],
    }
  );
});

test("topologicalSort", (t) => {
  t.plan(6);

  t.deepEqual(
    topologicalSort({
      size: 1,
      adjacencyMatrix: {
        a: { a: 0 },
      },
    }),
    ["a"]
  );

  t.deepEqual(
    topologicalSort({
      size: 3,
      adjacencyMatrix: {
        a: { a: 0, b: 0, c: 0 },
        b: { a: 0, b: 0, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
    }),
    ["a", "b", "c"]
  );

  t.deepEqual(
    topologicalSort({
      size: 3,
      adjacencyMatrix: {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 0, b: 0, c: 0 },
        c: { a: 1, b: 0, c: 0 },
      },
    }),
    ["c", "a", "b"]
  );

  t.deepEqual(
    topologicalSort({
      size: 3,
      adjacencyMatrix: {
        a: { a: 0, b: 0, c: 0 },
        b: { a: 1, b: 0, c: 0 },
        c: { a: 1, b: 0, c: 0 },
      },
    }),
    ["b", "c", "a"]
  );

  t.deepEqual(
    topologicalSort({
      size: 2,
      adjacencyMatrix: {
        a: { a: 0, b: 0 },
        b: { a: 10, b: 0 },
      },
    }),
    ["b", "a"]
  );

  t.throws(() => {
    topologicalSort({
      size: 2,
      adjacencyMatrix: {
        a: { a: 0, b: 1 },
        b: { a: 1, b: 0 },
      },
    });
  });
});
