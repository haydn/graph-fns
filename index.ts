type D3Graph = {
  nodes: Array<{
    id: string;
  }>;
  links: Array<{
    source: string;
    target: string;
  }>;
};

type Edge = [string, string];

type Graph = {
  [u: string]: {
    [v: string]: number;
  };
};

const addEdge = (graph: Graph, [u, v]: Edge, options?: { undirected?: boolean }): Graph => {
  const result = clone(graph);

  if (result[u][v] === 0) {
    result[u][v] = 1;
  }

  if (options?.undirected && result[v][u] === 0) {
    result[v][u] = 1;
  }

  return result;
};

const addVertex = (graph: Graph, vertex: string): Graph => {
  if (graph[vertex]) return graph;

  const result = clone(graph);

  for (let v in result) result[v][vertex] = 0;
  result[vertex] = {};
  for (let v in result) result[vertex][v] = 0;

  return result;
};

const ancestors = (graph: Graph, vertex: string): Set<string> => {
  if (isCyclic(graph)) throw "Cannot retrieve ancestors in a graph that contains cycles.";

  let result: Set<string> = new Set();

  for (let parent of parents(graph, vertex)) {
    result = new Set([...result, parent, ...ancestors(graph, parent)]);
  }

  return result;
};

const children = (graph: Graph, vertex: string): Set<string> => {
  const result: Set<string> = new Set();

  for (let v in graph[vertex]) {
    if (graph[vertex][v] !== 0) {
      result.add(v);
    }
  }

  return result;
};

const clone = (graph: Graph): Graph => {
  const result: Graph = {};

  for (let u in graph) {
    result[u] = {};
    for (let v in graph[u]) {
      result[u][v] = graph[u][v];
    }
  }

  return result;
};

const create = (size: number = 0, id: (i: number) => string = (i) => i.toString(10)): Graph => {
  const result: Graph = {};

  for (let i = 0; i < size; i++) {
    const u = id(i);
    result[u] = {};
    for (let j = 0; j < size; j++) {
      const v = id(j);
      result[u][v] = 0;
    }
  }

  return result;
};

const degree = (
  graph: Graph,
  vertex: string,
  options?: { weighted?: boolean; undirected?: boolean },
): number => {
  if (options?.undirected && !isUndirected(graph)) {
    throw Error(
      "Unable to calculate degree. Expected an undirected graph, but got a directed graph.",
    );
  }
  const resolvedGraph = options?.undirected ? toDirected(graph) : graph;
  return (
    indegree(resolvedGraph, vertex, { weighted: options?.weighted }) +
    outdegree(resolvedGraph, vertex, { weighted: options?.weighted })
  );
};

const descendants = (graph: Graph, vertex: string): Set<string> => {
  if (isCyclic(graph)) {
    throw Error("Cannot retrieve descendants in a graph that contains cycles.");
  }

  let result: Set<string> = new Set();

  for (let child of children(graph, vertex)) {
    result = new Set([...result, child, ...descendants(graph, child)]);
  }

  return result;
};

const edges = (graph: Graph, options?: { undirected?: boolean }): Set<Edge> => {
  if (options?.undirected && !isUndirected(graph)) {
    throw Error("Expected undirected graph, but got a directed graph.");
  }

  const resolvedGraph = options?.undirected ? toDirected(graph) : graph;
  const result: Set<Edge> = new Set([]);

  for (let u in resolvedGraph) {
    for (let v in resolvedGraph[u]) {
      if (resolvedGraph[u][v] !== 0) {
        result.add([u, v]);
      }
    }
  }

  return result;
};

const fromD3 = (d3Graph: D3Graph, options?: { undirected?: boolean }): Graph => {
  const result: Graph = {};

  for (let u of d3Graph.nodes) {
    result[u.id] = {};
    for (let v of d3Graph.nodes) {
      result[u.id][v.id] = 0;
    }
  }

  for (let { source: u, target: v } of d3Graph.links) {
    result[u][v] = result[u][v] === 0 ? 1 : result[u][v] + 1;
    if (options?.undirected && u != v) result[v][u] = result[v][u] === 0 ? 1 : result[v][u] + 1;
  }

  return result;
};

const getEdge = (graph: Graph, [u, v]: Edge): number => graph[u][v];

const indegree = (graph: Graph, vertex: string, options?: { weighted?: boolean }): number => {
  let result = 0;

  for (let u in graph) {
    if (graph[u][vertex] !== 0) {
      result += options?.weighted ? graph[u][vertex] : 1;
    }
  }

  return result;
};

const isCyclic = (graph: Graph, options?: { undirected?: boolean }): boolean => {
  if (options?.undirected && !isUndirected(graph)) {
    throw Error("Expected undirected graph, but got a directed graph.");
  }

  const visited: Set<string> = new Set();

  for (let i in graph) {
    const cycleFound = visited.has(i)
      ? false
      : options?.undirected
      ? _isCyclicUndirected(graph, visited, undefined, i)
      : _isCyclicDirected(graph, visited, new Set(), i);
    if (cycleFound) return true;
  }

  return false;
};

const _isCyclicDirected = (
  graph: Graph,
  visited: Set<string>,
  path: Set<string>,
  vertex: string,
): boolean => {
  visited.add(vertex);
  path.add(vertex);

  for (let i in graph[vertex]) {
    if (graph[vertex][i] !== 0) {
      const cycleFound = path.has(i) ? true : _isCyclicDirected(graph, visited, path, i);
      if (cycleFound) return true;
    }
  }

  path.delete(vertex);

  return false;
};

const _isCyclicUndirected = (
  graph: Graph,
  visited: Set<string>,
  parent: string,
  vertex: string,
): boolean => {
  visited.add(vertex);

  for (let i in graph[vertex]) {
    if (graph[vertex][i] !== 0) {
      const cycleFound = visited.has(i)
        ? i !== parent
        : _isCyclicUndirected(graph, visited, vertex, i);
      if (cycleFound) return true;
    }
  }

  return false;
};

const isUndirected = (graph: Graph): boolean => {
  for (let [u, v] of vertexPairs(graph)) {
    if (graph[u][v] !== graph[v][u]) return false;
  }
  return true;
};

const makeUndirected = (
  graph: Graph,
  merge: (a: number, b: number) => number = (a, b) => Math.max(a, b),
): Graph => {
  const result = clone(graph);

  for (let [u, v] of vertexPairs(graph)) {
    const weight =
      u === v || graph[u][v] === 0 || graph[v][u] === 0
        ? graph[u][v] || graph[v][u]
        : merge(graph[u][v], graph[v][u]);
    result[u][v] = weight;
    result[v][u] = weight;
  }

  return result;
};

const order = (graph: Graph): number => {
  let result = 0;
  for (let u in graph) result += 1;
  return result;
};

const outdegree = (graph: Graph, vertex: string, options?: { weighted?: boolean }): number => {
  let result = 0;

  for (let v in graph[vertex]) {
    if (graph[vertex][v] !== 0) {
      result += options?.weighted ? graph[vertex][v] : 1;
    }
  }

  return result;
};

const parents = (graph: Graph, vertex: string): Set<string> => {
  const result: Set<string> = new Set();

  for (let u in graph) {
    if (graph[u][vertex] !== 0) {
      result.add(u);
    }
  }

  return result;
};

const removeEdge = (graph: Graph, [u, v]: Edge, options?: { undirected?: boolean }): Graph => {
  const result = clone(graph);

  result[u][v] = 0;
  if (options?.undirected) result[v][u] = 0;

  return result;
};

const removeVertex = (graph: Graph, vertex: string): Graph => {
  const result: Graph = {};

  for (let u in graph) {
    if (u === vertex) continue;
    result[u] = {};
    for (let v in graph[u]) {
      if (v === vertex) continue;
      result[u][v] = graph[u][v];
    }
  }

  return result;
};

const setEdge = (
  graph: Graph,
  [u, v]: Edge,
  weight: number,
  options?: { undirected?: boolean },
): Graph => {
  const result = clone(graph);

  result[u][v] = weight;
  if (options?.undirected) result[v][u] = weight;

  return result;
};

const size = (graph: Graph, options?: { undirected?: boolean }): number => {
  if (options?.undirected && !isUndirected(graph)) {
    throw Error("Expected undirected graph, but got a directed graph.");
  }

  const resolvedGraph = options?.undirected ? toDirected(graph) : graph;
  let result = 0;

  for (let u in resolvedGraph) {
    for (let v in resolvedGraph[u]) {
      if (resolvedGraph[u][v] !== 0) {
        result += 1;
      }
    }
  }

  return result;
};

const toD3 = (graph: Graph, options?: { undirected?: boolean }): D3Graph => {
  if (options?.undirected && !isUndirected(graph)) {
    throw Error("Expected undirected graph, but got a directed graph.");
  }

  const resolvedGraph = options?.undirected ? toDirected(graph) : graph;
  const nodes = [];
  const links = [];

  for (let u in resolvedGraph) {
    nodes[nodes.length] = { id: u };
    for (let v in resolvedGraph[u]) {
      if (resolvedGraph[u][v] !== 0) {
        let i = resolvedGraph[u][v];
        do {
          links.push({ source: u, target: v });
          i -= 1;
        } while (i > 0);
      }
    }
  }

  return { nodes, links };
};

const toDirected = (graph: Graph): Graph => {
  if (!isUndirected(graph)) {
    return graph;
  }

  const result: Graph = {};
  const vertices = Object.keys(graph);

  for (let u = 0; u < vertices.length; u++) {
    result[vertices[u]] = {};
    for (let v = 0; v < vertices.length; v++) {
      result[vertices[u]][vertices[v]] = v >= u ? graph[vertices[u]][vertices[v]] : 0;
    }
  }

  return result;
};

const topologicalSort = (graph: Graph): Array<string> => {
  if (isCyclic(graph)) throw Error("Cannot sort a graph that contains cycles.");

  const result: Array<string> = [];
  const visited: Set<string> = new Set();
  const queue: Array<string> = [];
  const indegrees: { [id: string]: number } = {};

  for (let v of vertices(graph)) {
    indegrees[v] = indegree(graph, v);
  }

  for (let i in graph) {
    if (indegrees[i] === 0) {
      queue.push(i);
      visited.add(i);
    }
  }

  while (queue.length !== 0) {
    const v = queue.shift();
    result.push(v);
    for (let i in graph) {
      if (graph[v][i] !== 0 && !visited.has(i)) {
        indegrees[i] -= graph[v][i];
        if (indegrees[i] <= 0) {
          queue.push(i);
          visited.add(i);
        }
      }
    }
  }

  return result;
};

const transpose = (graph: Graph): Graph => {
  const result: Graph = {};

  for (let u in graph) {
    result[u] = {};
    for (let v in graph[u]) {
      result[u][v] = graph[v][u];
    }
  }

  return result;
};

const vertices = (graph: Graph): Set<string> => new Set(Object.keys(graph));

const vertexPairs = (graph: Graph): Set<[string, string]> => {
  const result: Set<[string, string]> = new Set();
  const vertices = Object.keys(graph);

  for (let u = 0; u < vertices.length; u++) {
    for (let v = u; v < vertices.length; v++) {
      result.add([vertices[u], vertices[v]]);
    }
  }

  return result;
};

export {
  D3Graph,
  Graph,
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
  // toDirected,
  // makeUndirected as toUndirected,
  topologicalSort,
  transpose,
  vertices,
  vertexPairs,
};
