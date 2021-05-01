type Graph = { [u: string]: { [v: string]: number } };

type D3Graph = {
  nodes: Array<{
    id: string;
  }>;
  links: Array<{
    source: string;
    target: string;
  }>;
};

const addEdge = (graph: Graph, edge: [string, string]): Graph => {
  const result = clone(graph);

  result[edge[0]][edge[1]] += 1;

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
    if (graph[vertex][v] > 0) {
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

const descendants = (graph: Graph, vertex: string): Set<string> => {
  if (isCyclic(graph)) throw "Cannot retrieve descendants in a graph that contains cycles.";

  let result: Set<string> = new Set();

  for (let child of children(graph, vertex)) {
    result = new Set([...result, child, ...descendants(graph, child)]);
  }

  return result;
};

const edges = (graph: Graph): Array<[string, string]> => {
  const result = [];

  for (let u in graph) {
    for (let v in graph[u]) {
      if (graph[u][v] > 0) {
        result.push([u, v]);
      }
    }
  }

  return result;
};

const fromD3 = (d3Graph: D3Graph): Graph => {
  const result: Graph = {};

  for (let u of d3Graph.nodes) {
    result[u.id] = {};
    for (let v of d3Graph.nodes) {
      result[u.id][v.id] = 0;
    }
  }

  for (let link of d3Graph.links) {
    result[link.source][link.target] += 1;
  }

  return result;
};

const indegrees = (graph: Graph): { [id: string]: number } => {
  const result: { [id: string]: number } = {};

  for (let i in graph) result[i] = 0;
  for (let u in graph) {
    for (let v in graph[u]) {
      result[v] += graph[u][v];
    }
  }

  return result;
};

const isCyclic = (graph: Graph): boolean => {
  const visited: Set<string> = new Set();
  const path: Set<string> = new Set();

  for (let i in graph) {
    if (visited.has(i)) continue;
    const cycleFound = _isCyclic(graph, visited, path, i);
    if (cycleFound) return true;
  }

  return false;
};

const _isCyclic = (
  graph: Graph,
  visited: Set<string>,
  path: Set<string>,
  vertex: string,
): boolean => {
  visited.add(vertex);
  path.add(vertex);

  for (let i in graph[vertex]) {
    if (graph[vertex][i] > 0) {
      if (visited.has(i)) {
        if (path.has(i)) return true;
        continue;
      }
      const cycleFound = _isCyclic(graph, visited, path, i);
      if (cycleFound) return true;
    }
  }

  path.delete(vertex);

  return false;
};

const order = (graph: Graph): number => {
  let result = 0;
  for (let u in graph) result += 1;
  return result;
};

const outdegrees = (graph: Graph): { [id: string]: number } => {
  const result: { [id: string]: number } = {};
  for (let i in graph) result[i] = 0;
  for (let u in graph) {
    for (let v in graph[u]) {
      result[v] += graph[v][u];
    }
  }
  return result;
};

const parents = (graph: Graph, vertex: string): Set<string> => {
  const result: Set<string> = new Set();

  for (let u in graph) {
    if (graph[u][vertex] > 0) {
      result.add(u);
    }
  }

  return result;
};

const removeEdge = (graph: Graph, edge: [string, string]): Graph => {
  const result = clone(graph);

  result[edge[0]][edge[1]] = 0;

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

const size = (graph: Graph): number => {
  let result = 0;

  for (let u in graph) {
    for (let v in graph[u]) {
      if (graph[u][v] > 0) {
        result += 1;
      }
    }
  }

  return result;
};

const toD3 = (graph: Graph): D3Graph => {
  const nodes = [];
  const links = [];

  for (let u in graph) {
    nodes[nodes.length] = { id: u };
    for (let v in graph[u]) {
      if (graph[u][v] > 0) {
        links.push({ source: u, target: v });
      }
    }
  }

  return { nodes, links };
};

const topologicalSort = (graph: Graph): Array<string> => {
  if (isCyclic(graph)) throw "Cannot sort a graph that contains cycles.";

  const result: Array<string> = [];
  const visited: Set<string> = new Set();
  const queue: Array<string> = [];
  const indegree = indegrees(graph);

  for (let i in graph) {
    if (indegree[i] === 0) {
      queue.push(i);
      visited.add(i);
    }
  }

  while (queue.length > 0) {
    const v = queue.shift();
    result.push(v);
    for (let i in graph) {
      if (graph[v][i] > 0 && !visited.has(i)) {
        indegree[i] -= graph[v][i];
        if (indegree[i] <= 0) {
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

const vertices = (graph: Graph): Array<string> => Object.keys(graph);

export {
  D3Graph,
  Graph,
  addEdge,
  addVertex,
  ancestors,
  children,
  clone,
  create,
  descendants,
  edges,
  fromD3,
  indegrees,
  isCyclic,
  order,
  outdegrees,
  parents,
  removeEdge,
  removeVertex,
  size,
  toD3,
  topologicalSort,
  transpose,
  vertices,
};
