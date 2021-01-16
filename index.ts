type Graph = {
  size: number;
  adjacencyMatrix: { [u: string]: { [v: string]: number } };
};

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
  const size = graph.size;
  const adjacencyMatrix: Graph["adjacencyMatrix"] = {};

  for (let u in graph.adjacencyMatrix) {
    adjacencyMatrix[u] = {};
    for (let v in graph.adjacencyMatrix[u]) {
      adjacencyMatrix[u][v] = graph.adjacencyMatrix[u][v];
    }
  }

  adjacencyMatrix[edge[0]][edge[1]] += 1;

  return {
    size,
    adjacencyMatrix,
  };
};

const addVertex = (graph: Graph, vertex: string): Graph => {
  if (graph.adjacencyMatrix[vertex]) return graph;

  const size = graph.size + 1;
  const adjacencyMatrix: Graph["adjacencyMatrix"] = {};

  for (let u in graph.adjacencyMatrix) {
    adjacencyMatrix[u] = {};
    for (let v in graph.adjacencyMatrix[u]) {
      adjacencyMatrix[u][v] = graph.adjacencyMatrix[u][v];
    }
  }

  for (let v in adjacencyMatrix) adjacencyMatrix[v][vertex] = 0;
  adjacencyMatrix[vertex] = {};
  for (let v in adjacencyMatrix) adjacencyMatrix[vertex][v] = 0;

  return {
    size,
    adjacencyMatrix,
  };
};

const create = (
  size: number = 0,
  id: (i: number) => string = (i) => i.toString(10)
): Graph => {
  const adjacencyMatrix: Graph["adjacencyMatrix"] = {};

  for (let i = 0; i < size; i++) {
    const u = id(i);
    adjacencyMatrix[u] = {};
    for (let j = 0; j < size; j++) {
      const v = id(j);
      adjacencyMatrix[u][v] = 0;
    }
  }

  return {
    size,
    adjacencyMatrix,
  };
};

const fromD3 = (d3Graph: D3Graph): Graph => {
  const size = d3Graph.nodes.length;
  const adjacencyMatrix: Graph["adjacencyMatrix"] = {};

  for (let u of d3Graph.nodes) {
    adjacencyMatrix[u.id] = {};
    for (let v of d3Graph.nodes) {
      adjacencyMatrix[u.id][v.id] = 0;
    }
  }

  for (let link of d3Graph.links) {
    adjacencyMatrix[link.source][link.target] += 1;
  }

  return {
    size,
    adjacencyMatrix,
  };
};

const inDegrees = (graph: Graph): { [id: string]: number } => {
  const result: { [id: string]: number } = {};
  for (let i in graph.adjacencyMatrix) result[i] = 0;
  for (let u in graph.adjacencyMatrix) {
    for (let v in graph.adjacencyMatrix[u]) {
      result[v] += graph.adjacencyMatrix[u][v];
    }
  }
  return result;
};

const isCyclic = (graph: Graph): boolean => {
  const visited: Set<string> = new Set();
  const path: Set<string> = new Set();
  for (let i in graph.adjacencyMatrix) {
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
  vertex: string
): boolean => {
  visited.add(vertex);
  path.add(vertex);

  for (let i in graph.adjacencyMatrix[vertex]) {
    if (graph.adjacencyMatrix[vertex][i] > 0) {
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

const outDegrees = (graph: Graph): { [id: string]: number } => {
  const result: { [id: string]: number } = {};
  for (let i in graph.adjacencyMatrix) result[i] = 0;
  for (let u in graph.adjacencyMatrix) {
    for (let v in graph.adjacencyMatrix[u]) {
      result[v] += graph.adjacencyMatrix[v][u];
    }
  }
  return result;
};

const removeEdge = (graph: Graph, edge: [string, string]): Graph => {
  const size = graph.size;
  const adjacencyMatrix: Graph["adjacencyMatrix"] = {};

  for (let u in graph.adjacencyMatrix) {
    adjacencyMatrix[u] = {};
    for (let v in graph.adjacencyMatrix[u]) {
      adjacencyMatrix[u][v] = graph.adjacencyMatrix[u][v];
    }
  }

  if (adjacencyMatrix[edge[0]][edge[1]] > 0) {
    adjacencyMatrix[edge[0]][edge[1]] -= 1;
  }

  return {
    size,
    adjacencyMatrix,
  };
};

const removeVertex = (graph: Graph, vertex: string): Graph => {
  const size = graph.size - 1;
  const adjacencyMatrix: Graph["adjacencyMatrix"] = {};

  for (let u in graph.adjacencyMatrix) {
    if (u === vertex) continue;
    adjacencyMatrix[u] = {};
    for (let v in graph.adjacencyMatrix[u]) {
      if (v === vertex) continue;
      adjacencyMatrix[u][v] = graph.adjacencyMatrix[u][v];
    }
  }

  return {
    size,
    adjacencyMatrix,
  };
};

const toD3 = (graph: Graph): D3Graph => {
  const nodes = [];
  const links = [];

  for (let u in graph.adjacencyMatrix) {
    nodes[nodes.length] = { id: u };
    for (let v in graph.adjacencyMatrix[u]) {
      for (let i = 0; i < graph.adjacencyMatrix[u][v]; i++) {
        links[links.length] = { source: u, target: v };
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
  const inDegree = inDegrees(graph);

  for (let i in graph.adjacencyMatrix) {
    if (inDegree[i] === 0) {
      queue.push(i);
      visited.add(i);
    }
  }

  while (queue.length > 0) {
    const v = queue.shift();
    result.push(v);
    for (let i in graph.adjacencyMatrix) {
      if (graph.adjacencyMatrix[v][i] > 0 && !visited.has(i)) {
        inDegree[i] -= graph.adjacencyMatrix[v][i];
        if (inDegree[i] <= 0) {
          queue.push(i);
          visited.add(i);
        }
      }
    }
  }

  return result;
};

export {
  D3Graph,
  Graph,
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
};
