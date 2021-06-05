import {
  addEdge,
  addVertex,
  ancestors,
  children,
  clone,
  create,
  degree,
  descendants,
  edges,
  fromD3,
  getEdge,
  indegree,
  isCyclic,
  isUndirected,
  makeUndirected,
  order,
  outdegree,
  parents,
  removeEdge,
  removeVertex,
  setEdge,
  size,
  toD3,
  topologicalSort,
  transpose,
  vertices,
  vertexPairs,
} from "./index";

import test from "tape";

test("addEdge", (t) => {
  t.plan(2);

  t.deepEqual(
    addEdge(
      {
        a: { a: 0, b: 0 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
    ),
    {
      a: { a: 0, b: 1 },
      b: { a: 0, b: 0 },
    },
    "Base case",
  );

  t.deepEqual(
    addEdge(
      {
        a: { a: 0, b: 1.5 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
    ),
    {
      a: { a: 0, b: 1.5 },
      b: { a: 0, b: 0 },
    },
    "Adding an edge that already exists should be a no-op",
  );
});

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

test("ancestors", (t) => {
  t.plan(3);

  t.deepEqual(
    ancestors(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 0, b: 0, c: 1 },
        c: { a: 0, b: 0, c: 0 },
      },
      "c",
    ),
    new Set(["a", "b"]),
  );

  t.deepEqual(
    ancestors(
      {
        a: { a: 0, b: 1, c: 0, d: 0 },
        b: { a: 0, b: 0, c: 1, d: 1 },
        c: { a: 0, b: 0, c: 0, d: 1 },
        d: { a: 0, b: 0, c: 0, d: 0 },
      },
      "d",
    ),
    new Set(["a", "b", "c"]),
  );

  t.throws(() => {
    ancestors(
      {
        a: { a: 0, b: 1 },
        b: { a: 1, b: 0 },
      },
      "b",
    );
  }, "Graphs with cycles should throw an error");
});

test("children", (t) => {
  t.plan(2);

  t.deepEqual(
    children(
      {
        a: { a: 0, b: 1, c: 1 },
        b: { a: 0, b: 0, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
      "a",
    ),
    new Set(["b", "c"]),
  );

  t.deepEqual(
    children(
      {
        a: { a: 1 },
      },
      "a",
    ),
    new Set(["a"]),
    "Loops should cause the vertex to be listed as a child of itself",
  );
});

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

test("create", (t) => {
  t.plan(2);

  t.deepEqual(create(1), { 0: { 0: 0 } }), "Base case";

  t.deepEqual(
    create(2, (i) => `${i}!`),
    {
      "0!": { "0!": 0, "1!": 0 },
      "1!": { "0!": 0, "1!": 0 },
    },
    "Custom ID function is used",
  );
});

test("degree", (t) => {
  t.plan(5);

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
      true,
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
      true,
    ),
    3,
    "Loops should count twice towards the degree",
  );
});

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
  });
});

test("edges", (t) => {
  t.plan(2);

  t.deepEqual(
    edges({
      a: { a: 0, b: 1, c: 0 },
      b: { a: 0, b: 0, c: 1 },
      c: { a: 0, b: 0, c: 0 },
    }),
    new Set([
      ["a", "b"],
      ["b", "c"],
    ]),
  );

  t.deepEqual(
    edges({
      a: { a: 0, b: 2, c: 0 },
      b: { a: 0, b: 0, c: 1 },
      c: { a: 0.5, b: 0, c: 0 },
    }),
    new Set([
      ["a", "b"],
      ["b", "c"],
      ["c", "a"],
    ]),
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
      a: { a: 1, b: 1, c: 1 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    },
  );
});

test("getEdge", (t) => {
  t.plan(1);

  t.equal(
    getEdge(
      {
        a: { a: 0, b: 1.5 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
    ),
    1.5,
  );
});

test("indegree", (t) => {
  t.plan(2);

  t.equal(
    indegree(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 2, b: 0, c: 0 },
        c: { a: 0.5, b: 0, c: 0 },
      },
      "a",
    ),
    2,
  );

  t.equal(
    indegree(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 2, b: 0, c: 0 },
        c: { a: 0.5, b: 0, c: 0 },
      },
      "a",
      true,
    ),
    2.5,
  );
});

test("isCyclic", (t) => {
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

test("makeUndirected", (t) => {
  t.plan(5);

  t.deepEqual(makeUndirected({}), {});

  t.deepEqual(makeUndirected({ a: { a: 1 } }), { a: { a: 1 } });

  t.deepEqual(
    makeUndirected({
      a: { a: 1, b: 1, c: 0 },
      b: { a: 0, b: 0, c: 1 },
      c: { a: 0, b: 0, c: 0 },
    }),
    {
      a: { a: 1, b: 1, c: 0 },
      b: { a: 1, b: 0, c: 1 },
      c: { a: 0, b: 1, c: 0 },
    },
  );

  t.deepEqual(
    makeUndirected({
      a: { a: 0.5, b: -1, c: 0 },
      b: { a: 0, b: 0, c: -1 },
      c: { a: 0, b: 0, c: 0 },
    }),
    {
      a: { a: 0.5, b: -1, c: 0 },
      b: { a: -1, b: 0, c: -1 },
      c: { a: 0, b: -1, c: 0 },
    },
  );

  t.deepEqual(
    makeUndirected(
      {
        a: { a: 2, b: 3, c: 0 },
        b: { a: 2, b: 0, c: 1 },
        c: { a: 0, b: 0, c: 0 },
      },
      (a, b) => a * b,
    ),
    {
      a: { a: 2, b: 6, c: 0 },
      b: { a: 6, b: 0, c: 1 },
      c: { a: 0, b: 1, c: 0 },
    },
  );
});

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

test("outdegree", (t) => {
  t.plan(2);

  t.equal(
    outdegree(
      {
        a: { a: 0, b: 2, c: 0.5 },
        b: { a: 1, b: 0, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
      "a",
    ),
    2,
  );

  t.equal(
    outdegree(
      {
        a: { a: 0, b: 2, c: 0.5 },
        b: { a: 1, b: 0, c: 0 },
        c: { a: 0, b: 0, c: 0 },
      },
      "a",
      true,
    ),
    2.5,
  );
});

test("parents", (t) => {
  t.plan(2);

  t.deepEqual(
    parents(
      {
        a: { a: 0, b: 0, c: 1 },
        b: { a: 0, b: 0, c: 0.5 },
        c: { a: 0, b: 0, c: 0 },
      },
      "c",
    ),
    new Set(["a", "b"]),
  );

  t.deepEqual(
    parents(
      {
        a: { a: 1 },
      },
      "a",
    ),
    new Set(["a"]),
  );
});

test("removeEdge", (t) => {
  t.plan(2);

  t.deepEqual(
    removeEdge(
      {
        a: { a: 0, b: 1.5, c: 0 },
        b: { a: 0, b: 0, c: 0.5 },
        c: { a: 2, b: 0, c: 0 },
      },
      ["a", "b"],
    ),
    {
      a: { a: 0, b: 0, c: 0 },
      b: { a: 0, b: 0, c: 0.5 },
      c: { a: 2, b: 0, c: 0 },
    },
  );

  t.deepEqual(
    removeEdge(
      {
        a: { a: 0, b: 2 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
    ),
    {
      a: { a: 0, b: 0 },
      b: { a: 0, b: 0 },
    },
  );
});

test("removeVertex", (t) => {
  t.plan(1);

  t.deepEqual(
    removeVertex(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 0, b: 0, c: 1 },
        c: { a: 1, b: 0, c: 0 },
      },
      "b",
    ),
    {
      a: { a: 0, c: 0 },
      c: { a: 1, c: 0 },
    },
  );
});

test("setEdge", (t) => {
  t.plan(3);

  t.deepEqual(
    setEdge(
      {
        a: { a: 0, b: 0 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
      1,
    ),
    {
      a: { a: 0, b: 1 },
      b: { a: 0, b: 0 },
    },
  );

  t.deepEqual(
    setEdge(
      {
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
      0,
    ),
    {
      a: { a: 0, b: 0 },
      b: { a: 0, b: 0 },
    },
  );

  t.deepEqual(
    setEdge(
      {
        a: { a: 0, b: 1 },
        b: { a: 0, b: 0 },
      },
      ["a", "b"],
      1.5,
    ),
    {
      a: { a: 0, b: 1.5 },
      b: { a: 0, b: 0 },
    },
  );
});

test("size", (t) => {
  t.plan(3);

  t.equal(size({}), 0);

  t.equal(
    size({
      a: { a: 1, b: 0 },
      b: { a: 0, b: 0 },
    }),
    1,
  );

  t.equal(
    size({
      a: { a: 3, b: 0, c: 0 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 1, b: 0, c: 0 },
    }),
    2,
  );
});

test("toD3", (t) => {
  t.plan(1);

  t.deepEqual(
    toD3({
      a: { a: 1, b: 2, c: 0.5 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    }),
    {
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      links: [
        { source: "a", target: "a" },
        { source: "a", target: "b" },
        { source: "a", target: "b" },
        { source: "a", target: "c" },
      ],
    },
  );
});

test("topologicalSort", (t) => {
  t.plan(6);

  t.deepEqual(
    topologicalSort({
      a: { a: 0 },
    }),
    ["a"],
  );

  t.deepEqual(
    topologicalSort({
      a: { a: 0, b: 0, c: 0 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    }),
    ["a", "b", "c"],
  );

  t.deepEqual(
    topologicalSort({
      a: { a: 0, b: 1, c: 0 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 1, b: 0, c: 0 },
    }),
    ["c", "a", "b"],
  );

  t.deepEqual(
    topologicalSort({
      a: { a: 0, b: 0, c: 0 },
      b: { a: 1, b: 0, c: 0 },
      c: { a: 1, b: 0, c: 0 },
    }),
    ["b", "c", "a"],
  );

  t.deepEqual(
    topologicalSort({
      a: { a: 0, b: 0 },
      b: { a: 10, b: 0 },
    }),
    ["b", "a"],
  );

  t.throws(() => {
    topologicalSort({
      a: { a: 0, b: 1 },
      b: { a: 1, b: 0 },
    });
  });
});

test("transpose", (t) => {
  t.plan(5);

  t.deepEqual(
    transpose({
      a: { a: 0 },
    }),
    {
      a: { a: 0 },
    },
  );

  t.deepEqual(
    transpose({
      a: { a: 0, b: 1 },
      b: { a: 0, b: 0 },
    }),
    {
      a: { a: 0, b: 0 },
      b: { a: 1, b: 0 },
    },
  );

  t.deepEqual(
    transpose({
      a: { a: 0, b: -0.5 },
      b: { a: 0, b: 0 },
    }),
    {
      a: { a: 0, b: 0 },
      b: { a: -0.5, b: 0 },
    },
  );

  t.deepEqual(
    transpose({
      a: { a: 0, b: 1, c: 1 },
      b: { a: 0, b: 0, c: 1 },
      c: { a: 0, b: 0, c: 0 },
    }),
    {
      a: { a: 0, b: 0, c: 0 },
      b: { a: 1, b: 0, c: 0 },
      c: { a: 1, b: 1, c: 0 },
    },
  );

  t.deepEqual(
    transpose({
      a: { a: 1, b: 1, c: 1 },
      b: { a: 1, b: 1, c: 1 },
      c: { a: 1, b: 1, c: 1 },
    }),
    {
      a: { a: 1, b: 1, c: 1 },
      b: { a: 1, b: 1, c: 1 },
      c: { a: 1, b: 1, c: 1 },
    },
  );
});

test("vertices", (t) => {
  t.plan(1);

  t.deepEqual(
    vertices({
      a: { a: 0, b: 0, c: 0 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    }),
    new Set(["a", "b", "c"]),
  );
});

test("vertexPairs", (t) => {
  t.plan(1);

  t.deepEqual(
    vertexPairs({
      a: { a: 0, b: 0, c: 0 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    }),
    new Set([
      ["a", "a"],
      ["a", "b"],
      ["a", "c"],
      ["b", "b"],
      ["b", "c"],
      ["c", "c"],
    ]),
  );
});
