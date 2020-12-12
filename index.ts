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

export { Graph, D3Graph, isCyclic, fromD3, toD3 };
