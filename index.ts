type Graph<T extends string = string> = Record<T, Record<T, number>>;

type D3Graph<T extends string = string> = {
  nodes: Array<{
    id: T;
  }>;
  links: Array<{
    source: T;
    target: T;
  }>;
};

const addEdge = <T extends string = string>(
  graph: Graph<T>,
  [u, v]: [T, T],
  options?: { undirected?: boolean },
): Graph<T> => {
  const result = clone<T>(graph);

  if (result[u][v] === 0) {
    result[u][v] = 1;
  }

  if (options?.undirected && result[v][u] === 0) {
    result[v][u] = 1;
  }

  return result;
};

const addVertex = <T1 extends string = string, T2 extends T1 | string = string>(
  graph: Graph<T1>,
  vertex: T2,
): Graph<T2> => {
  if (vertex in graph) return graph as Graph<T2>;

  const result = clone<T1>(graph) as Graph<T2>;

  for (let v in result) result[v][vertex] = 0;
  result[vertex] = {} as Graph<T2>[T2];
  for (let v in result) result[vertex][v] = 0;

  return result;
};

const ancestors = <T1 extends string = string, T2 extends T1 = T1>(
  graph: Graph<T1>,
  vertex: T2,
): Set<T1> => {
  if (isCyclic(graph)) throw "Cannot retrieve ancestors in a graph that contains cycles.";

  let result: Set<T1> = new Set();

  for (let parent of parents(graph, vertex)) {
    result = new Set([...result, parent, ...ancestors(graph, parent)]);
  }

  return result;
};

const children = <T1 extends string = string, T2 extends T1 = T1>(
  graph: Graph<T1>,
  vertex: T2,
): Set<T1> => {
  const result: Set<T1> = new Set();
  const vertices = Object.keys(graph) as Array<T1>;

  for (let v of vertices) {
    if (graph[vertex][v] !== 0) {
      result.add(v);
    }
  }

  return result;
};

const clone = <T extends string = string>(graph: Graph<T>): Graph<T> => {
  const result = {} as Graph<T>;

  for (let u in graph) {
    result[u] = {} as Graph<T>[T];
    for (let v in graph[u]) {
      result[u][v] = graph[u][v];
    }
  }

  return result;
};

const create = <T extends string = string>(size: number, identFn: (i: number) => T): Graph<T> => {
  const result = {} as Graph<T>;

  for (let i = 0; i < size; i++) {
    const u = identFn(i);
    result[u] = {} as Graph<T>[T];
    for (let j = 0; j < size; j++) {
      const v = identFn(j);
      result[u][v] = 0;
    }
  }

  return result;
};

const degree = <T1 extends string = string, T2 extends T1 = T1>(
  graph: Graph<T1>,
  vertex: T2,
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

const descendants = <T1 extends string = string, T2 extends T1 = T1>(
  graph: Graph<T1>,
  vertex: T2,
): Set<T1> => {
  if (isCyclic(graph)) {
    throw Error("Cannot retrieve descendants in a graph that contains cycles.");
  }

  let result: Set<T1> = new Set();

  for (let child of children(graph, vertex)) {
    result = new Set([...result, child, ...descendants(graph, child)]);
  }

  return result;
};

const edges = <T extends string = string>(
  graph: Graph<T>,
  options?: { undirected?: boolean },
): Set<[T, T]> => {
  if (options?.undirected && !isUndirected(graph)) {
    throw Error("Expected undirected graph, but got a directed graph.");
  }

  const resolvedGraph = options?.undirected ? toDirected(graph) : graph;
  const result: Set<[T, T]> = new Set([]);
  const vertices = Object.keys(resolvedGraph) as Array<T>;

  for (let u of vertices) {
    for (let v of vertices) {
      if (resolvedGraph[u][v] !== 0) {
        result.add([u, v]);
      }
    }
  }

  return result;
};

const fromD3 = <T extends string = string>(
  d3Graph: D3Graph<T>,
  options?: { undirected?: boolean },
): Graph<T> => {
  const result = {} as Graph<T>;

  for (let u of d3Graph.nodes) {
    result[u.id] = {} as Graph<T>[T];
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

const getEdge = <T extends string = string>(graph: Graph<T>, [u, v]: [T, T]): number => graph[u][v];

const indegree = <T1 extends string = string, T2 extends T1 = T1>(
  graph: Graph<T1>,
  vertex: T2,
  options?: { weighted?: boolean },
): number => {
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
  parent: string | undefined,
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

const makeUndirected = <T extends string = string>(
  graph: Graph<T>,
  merge: (a: number, b: number) => number = (a, b) => Math.max(a, b),
): Graph<T> => {
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

const outdegree = <T1 extends string = string, T2 extends T1 = T1>(
  graph: Graph<T1>,
  vertex: T2,
  options?: { weighted?: boolean },
): number => {
  let result = 0;

  for (let v in graph[vertex]) {
    if (graph[vertex][v] !== 0) {
      result += options?.weighted ? graph[vertex][v] : 1;
    }
  }

  return result;
};

const parents = <T1 extends string = string, T2 extends T1 = T1>(
  graph: Graph<T1>,
  vertex: T2,
): Set<T1> => {
  const result: Set<T1> = new Set();

  for (let u in graph) {
    if (graph[u][vertex] !== 0) {
      result.add(u);
    }
  }

  return result;
};

const removeEdge = <T1 extends string = string, T2 extends T1 = T1>(
  graph: Graph<T1>,
  [u, v]: [T2, T2],
  options?: { undirected?: boolean },
): Graph<T1> => {
  const result = clone(graph);

  result[u][v] = 0;
  if (options?.undirected) result[v][u] = 0;

  return result;
};

const removeVertex = <T1 extends string = string, T2 extends T1 = T1>(
  graph: Graph<T1>,
  vertex: T2,
): Graph<Exclude<T1, T2>> => {
  const result = {} as Graph<Exclude<T1, T2>>;
  const vertices = Object.keys(graph) as Array<T1>;
  const newVertices = vertices.filter((x): x is Exclude<T1, T2> => x !== vertex);

  for (let u of newVertices) {
    result[u] = {} as Graph<Exclude<T1, T2>>[Exclude<T1, T2>];
    for (let v of newVertices) {
      result[u][v] = graph[u][v];
    }
  }

  return result;
};

const setEdge = <T extends string = string>(
  graph: Graph<T>,
  [u, v]: [T, T],
  weight: number,
  options?: { undirected?: boolean },
): Graph<T> => {
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

const toD3 = <T extends string = string>(
  graph: Graph<T>,
  options?: { undirected?: boolean },
): D3Graph<T> => {
  if (options?.undirected && !isUndirected(graph)) {
    throw Error("Expected undirected graph, but got a directed graph.");
  }

  const resolvedGraph = options?.undirected ? toDirected(graph) : graph;
  const nodes: Array<{ id: T }> = [];
  const links: Array<{ source: T; target: T }> = [];
  const vertices = Object.keys(resolvedGraph) as Array<T>;

  for (let u of vertices) {
    nodes[nodes.length] = { id: u };
    for (let v of vertices) {
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

const toDirected = <T extends string = string>(graph: Graph<T>): Graph<T> => {
  if (!isUndirected(graph)) {
    return graph;
  }

  const result = {} as Graph<T>;
  const vertices = Object.keys(graph) as Array<T>;

  for (let u = 0; u < vertices.length; u++) {
    result[vertices[u]] = {} as Graph<T>[T];
    for (let v = 0; v < vertices.length; v++) {
      const uuu = vertices[u];
      const vvv = vertices[v];
      result[uuu][vvv] = v >= u ? graph[vertices[u]][vertices[v]] : 0;
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
  const vertices = Object.keys(graph);

  for (let v of vertices) {
    indegrees[v] = indegree(graph, v);
  }

  for (let i in graph) {
    if (indegrees[i] === 0) {
      queue.push(i);
      visited.add(i);
    }
  }

  while (queue.length !== 0) {
    const v = queue.shift()!;
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

const transpose = <T extends string = string>(graph: Graph<T>): Graph<T> => {
  const result = {} as Graph<T>;
  const vertices = Object.keys(graph) as Array<T>;

  for (let u of vertices) {
    result[u] = {} as Graph<T>[T];
    for (let v of vertices) {
      result[u][v] = graph[v][u];
    }
  }

  return result;
};

const vertices = <T extends string = string>(graph: Graph<T>): Set<T> =>
  new Set<T>(Object.keys(graph) as Array<T>);

const vertexPairs = <T extends string = string>(graph: Graph<T>): Set<[T, T]> => {
  const result: Set<[T, T]> = new Set();
  const vertices = Object.keys(graph) as Array<T>;

  for (let u = 0; u < vertices.length; u++) {
    for (let v = u; v < vertices.length; v++) {
      result.add([vertices[u], vertices[v]]);
    }
  }

  return result;
};

export {
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

export type { D3Graph, Graph };
