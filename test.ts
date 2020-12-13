import { fromD3, isCyclic, toD3, topologicalSort } from "./index";

import { strict as assert } from "assert";

assert.equal(
  isCyclic({
    size: 1,
    adjacencyMatrix: [[0]],
  }),
  false
);

assert.equal(
  isCyclic({
    size: 2,
    adjacencyMatrix: [
      [0, 0],
      [0, 0],
    ],
  }),
  false
);

assert.equal(
  isCyclic({
    size: 2,
    adjacencyMatrix: [
      [0, 1],
      [0, 0],
    ],
  }),
  false
);

assert.equal(
  isCyclic({
    size: 3,
    adjacencyMatrix: [
      [0, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
  }),
  false
);

assert.equal(
  isCyclic({
    size: 1,
    adjacencyMatrix: [[1]],
  }),
  true
);

assert.equal(
  isCyclic({
    size: 2,
    adjacencyMatrix: [
      [0, 1],
      [1, 0],
    ],
  }),
  true
);

assert.equal(
  isCyclic({
    size: 3,
    adjacencyMatrix: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 0, 0],
    ],
  }),
  true
);

assert.equal(
  isCyclic({
    size: 2,
    adjacencyMatrix: [
      [1, 0],
      [0, 1],
    ],
  }),
  true
);

assert.deepEqual(
  topologicalSort({
    size: 1,
    adjacencyMatrix: [[0]],
  }),
  [0]
);

assert.deepEqual(
  topologicalSort({
    size: 3,
    adjacencyMatrix: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
  }),
  [0, 1, 2]
);

assert.deepEqual(
  topologicalSort({
    size: 3,
    adjacencyMatrix: [
      [0, 1, 0],
      [0, 0, 0],
      [1, 0, 0],
    ],
  }),
  [2, 0, 1]
);

assert.deepEqual(
  topologicalSort({
    size: 3,
    adjacencyMatrix: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 0, 0],
    ],
  }),
  [1, 2, 0]
);

assert.deepEqual(
  topologicalSort({
    size: 2,
    adjacencyMatrix: [
      [0, 0],
      [10, 0],
    ],
  }),
  [1, 0]
);

assert.throws(() => {
  topologicalSort({
    size: 2,
    adjacencyMatrix: [
      [0, 1],
      [1, 0],
    ],
  });
});

assert.deepEqual(
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
    adjacencyMatrix: [
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
  }
);

assert.deepEqual(
  toD3({
    size: 3,
    adjacencyMatrix: [
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
  }),
  {
    nodes: [{ id: "0" }, { id: "1" }, { id: "2" }],
    links: [
      { source: "0", target: "0" },
      { source: "0", target: "1" },
      { source: "0", target: "2" },
    ],
  }
);
