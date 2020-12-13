type Graph = {
  size: number;
  adjacencyMatrix: Array<Array<number>>;
  // edgeWeight: Array<Array<Array<number>>>;
  // vertexData: Array<V>;
  // edgeData: Array<Array<E>>;
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

const toD3 = (graph: Graph): D3Graph => {
  const nodes = [];
  for (let i = 0; i < graph.size; i++) {
    nodes[i] = { id: i.toString(10) };
  }

  const links = [];
  for (let u = 0; u < graph.size; u++) {
    for (let v = 0; v < graph.size; v++) {
      const edges = graph.adjacencyMatrix[u][v];
      if (edges !== undefined) {
        for (let i = 0; i < edges; i++) {
          links.push({
            source: u.toString(10),
            target: v.toString(10),
          });
        }
      }
    }
  }

  return { nodes, links };
};

const fromD3 = (graph: D3Graph): Graph => {
  const idToIndexMap: {
    [id: string]: number;
  } = {};
  for (let i = 0; i < graph.nodes.length; i++) {
    idToIndexMap[graph.nodes[i].id] = i;
  }

  const adjacencyMatrix: Graph["adjacencyMatrix"] = [];
  for (let u = 0; u < graph.nodes.length; u++) {
    adjacencyMatrix[u] = [];
    for (let v = 0; v < graph.nodes.length; v++) {
      adjacencyMatrix[u][v] = 0;
    }
  }
  for (let link of graph.links) {
    const u = idToIndexMap[link.source];
    const v = idToIndexMap[link.target];
    adjacencyMatrix[u][v] += 1;
  }

  return {
    size: graph.nodes.length,
    adjacencyMatrix,
  };
};

const _isCyclic = (
  graph: Graph,
  visited: Set<number>,
  path: Set<number>,
  vertex: number
): boolean => {
  visited.add(vertex);
  path.add(vertex);

  for (let i = 0; i < graph.size; i++) {
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

const isCyclic = (graph: Graph): boolean => {
  const visited: Set<number> = new Set();
  const path: Set<number> = new Set();
  for (let i = 0; i < graph.size; i++) {
    if (visited.has(i)) continue;
    const cycleFound = _isCyclic(graph, visited, path, i);
    if (cycleFound) return true;
  }
  return false;
};

const getInDegrees = (graph: Graph): Array<number> => {
  const result: Array<number> = [];
  for (let i = 0; i < graph.size; i++) {
    result[i] = 0;
  }
  for (let u = 0; u < graph.size; u++) {
    for (let v = 0; v < graph.size; v++) {
      result[v] += graph.adjacencyMatrix[u][v];
    }
  }
  return result;
};

const topologicalSort = (graph: Graph): Array<number> => {
  if (isCyclic(graph)) throw "Cannot sort a graph that contains cycles.";

  const result: Array<number> = [];
  const visited: Set<number> = new Set();
  const queue: Array<number> = [];
  const inDegree = getInDegrees(graph);
  
  for (let i = 0; i < graph.size; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
      visited.add(i);
    }
  }
  
  while (queue.length > 0) {
    const v = queue.shift();
    result.push(v);
    for (let i = 0; i < graph.size; i++) {
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

export { Graph, D3Graph, isCyclic, topologicalSort, fromD3, toD3 };
