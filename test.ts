import {
  addEdge,
  addVertex,
  clone,
  create,
  edges,
  fromD3,
  indegrees,
  isCyclic,
  order,
  outdegrees,
  removeEdge,
  removeVertex,
  size,
  toD3,
  topologicalSort,
  transpose,
  vertices,
} from "./index";

import test from "tape";

test("addEdge", (t) => {
  t.plan(1);

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
  );
});

test("addVertex", (t) => {
  t.plan(2);

  t.deepEqual(addVertex({}, "a"), {
    a: { a: 0 },
  });

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
  );
});

test("clone", (t) => {
  t.plan(4);

  const orginal = {
    a: { a: 0, b: 1 },
    b: { a: 0, b: 0 },
  };

  t.deepEqual(clone(orginal), orginal);
  t.notEqual(clone(orginal), orginal);
  t.notEqual(clone(orginal).a, orginal.a);
  t.notEqual(clone(orginal).b, orginal.b);
});

test("create", (t) => {
  t.plan(1);

  t.deepEqual(
    create(2, (i) => `${i}!`),
    {
      "0!": { "0!": 0, "1!": 0 },
      "1!": { "0!": 0, "1!": 0 },
    },
  );
});

test("edges", (t) => {
  t.plan(2);

  t.deepEqual(
    edges({
      a: { a: 0, b: 1, c: 0 },
      b: { a: 0, b: 0, c: 1 },
      c: { a: 0, b: 0, c: 0 },
    }),
    [
      ["a", "b"],
      ["b", "c"],
    ],
  );

  t.deepEqual(
    edges({
      a: { a: 0, b: 2, c: 0 },
      b: { a: 0, b: 0, c: 1 },
      c: { a: 0.5, b: 0, c: 0 },
    }),
    [
      ["a", "b"],
      ["b", "c"],
      ["c", "a"],
    ],
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

test("indegrees", (t) => {
  t.plan(1);

  t.deepEqual(
    indegrees({
      a: { a: 1, b: 1, c: 1 },
      b: { a: 0, b: 1, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    }),
    { a: 1, b: 2, c: 1 },
  );
});

test("isCyclic", (t) => {
  t.plan(8);

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

test("outdegrees", (t) => {
  t.plan(1);

  t.deepEqual(
    outdegrees({
      a: { a: 1, b: 1, c: 1 },
      b: { a: 0, b: 1, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    }),
    { a: 3, b: 1, c: 0 },
  );
});

test("removeEdge", (t) => {
  t.plan(2);

  t.deepEqual(
    removeEdge(
      {
        a: { a: 0, b: 1, c: 0 },
        b: { a: 0, b: 0, c: 1 },
        c: { a: 1, b: 0, c: 0 },
      },
      ["a", "b"],
    ),
    {
      a: { a: 0, b: 0, c: 0 },
      b: { a: 0, b: 0, c: 1 },
      c: { a: 1, b: 0, c: 0 },
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
      a: { a: 1, b: 2, c: 1 },
      b: { a: 0, b: 0, c: 0 },
      c: { a: 0, b: 0, c: 0 },
    }),
    {
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      links: [
        { source: "a", target: "a" },
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
  t.plan(4);

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
    ["a", "b", "c"],
  );
});
