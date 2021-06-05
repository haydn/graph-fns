<div align="center">
  <h1>
    <img src="logo.png" alt="graph-fns" width="160" />
  </h1>
  <p>A utility library for working with graphs in JavaScript.</p>
  <p>
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/graph-fns.svg">
    <img alt="npm" src="https://img.shields.io/npm/dw/graph-fns.svg">
  </p>
</div>

## Features

- Pure functions and immutable data patterns.
- Works in Node.js and browser runtimes.
- Flow and TypeScript declarations included.
- CommonJS, UMD and ESM modules provided.
- Zero dependencies.
- D3.js interoperability.

## Demo

https://h2788.csb.app/

![](screenshot.png)

## Installation

Yarn:

```shell
yarn add graph-fns
```

npm:

```shell
npm install graph-fns
```

## Usage

```js
import { create, addEdge, isCyclic, topologicalSort, degree, addVertex } from "graph-fns";

let graph = create(3, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B", "C" }

graph = addEdge(graph, ["A", "C"]);
//=> Graph { "A" -> "C", "B" }

graph = addEdge(graph, ["B", "A"]);
//=> Graph { "A" -> "C", "B" -> "A" }

isCyclic(graph);
//=> false

topologicalSort(graph);
//=> ["B", "A", "C"]

degree(graph, "A");
//=> 2

graph = addVertex(graph, "D");
//=> Graph { "A" -> "C", "B" -> "A", "D" }

graph = addEdge(graph, ["C", "D"]);
//=> Graph { "A" -> "C", "B" -> "A", "C" -> "D" }

descendants(graph, "A");
//=> Set { "C", "D" }

graph = addEdge(graph, ["D", "B"]);
//=> Graph { "A" -> "C", "B" -> "A", "C" -> "D", "D" -> "B" }

isCyclic(graph);
//=> true
```

## Terminology

| Term | Description |
| --- | --- |
| graph / network | A system of vertices connected in pairs by edges. ([Wikipedia](<https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)>)) |
| vertex / node | The fundamental unit of which graphs are formed. ([Wikipedia](<https://en.wikipedia.org/wiki/Vertex_(graph_theory)>)) |
| edge / link / branch / arc | A connection between two vertices in a graph. ([Wikipedia](<https://en.wikipedia.org/wiki/Edge_(graph_theory)>)) |
| order | The number of vertices in a graph. |
| size | The number of edges in a graph. |
| weighted graph | A graph with a numeric weight associated with each edge. ([Wolfram MathWorld](https://mathworld.wolfram.com/WeightedGraph.html)) |
| directed graph | A graph where the edges have direction. ([Wikipedia](https://en.wikipedia.org/wiki/Directed_graph)) |
| undirected graph | A graph where the edges do not have a direction. ([Math Insight](https://mathinsight.org/definition/undirected_graph)) |
| path | A sequence of edges that connect a set of vertices where each vertex is distinct. ([Wikipedia](<https://en.wikipedia.org/wiki/Path_(graph_theory)>)) |
| directed path | A path where all edges are orientated in the same direction. |
| undirected path | A path where the edges can be orientated in any direction. |
| loop / buckle | An edge which starts and ends at the same node. ([Wikipedia](<(https://en.wikipedia.org/wiki/Loop_(graph_theory))>) |
| cycle | A path that starts and ends at the same node. ([Wikipedia](<https://en.wikipedia.org/wiki/Cycle_(graph_theory)>)) |

## Types

### D3Graph

```ts
declare type D3Graph = {
  nodes: Array<{
    id: string;
  }>;
  links: Array<{
    source: string;
    target: string;
  }>;
};
```

A representation a graph convenient for using with [D3.js force-directed graphs](https://github.com/d3/d3-force).

### Edge

```ts
declare type Edge = [string, string];
```

### Graph

```ts
declare type Graph = {
  [u: string]: {
    [v: string]: number;
  };
};
```

This is the main data structure used by graph-fns to represent a _graph_. It is an [adjacency matrix](https://en.wikipedia.org/wiki/Adjacency_matrix) where each number in the matrix describes the edge from vertex `u` to vertex `v`. By default, a value of `1` is used to indicate there is a edge between the two vertices, but any value other than `0` can be used to signify the presence of an edge (typically used to describe a weighted graph).

## Functions

### addEdge

```ts
declare const addEdge: (graph: Graph, [u, v]: Edge) => Graph;
```

Adds a new edge to the graph from vertex `u` to vertex `v`.

**Note**: `addEdge(graph, edge)` is equivalent to `setEdge(graph, edge, 1)`.

```js
let graph = create(3, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B", "C" }

graph = addEdge(graph, ["A", "B"]);
//=> Graph { "A" -> "B", "C" }
```

Also see:

- [removeEdge](#removeEdge)
- [getEdge](#getEdge)
- [setEdge](#setEdge)

### addVertex

```ts
declare const addVertex: (graph: Graph, vertex: string) => Graph;
```

Adds a new vertex to the graph. The new vertex will not have any edges connecting it to existing vertices in the graph.

**Note**: If the vertex already exists the graph will be returned unmodified.

Also see:

- [removeVertex](#removeVertex)

### ancestors

```ts
declare const ancestors: (graph: Graph, vertex: string) => Set<string>;
```

Given a [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph), returns all ancestors of the given vertex (i.e. vertices from which there is a directed path to the given vertex).

**Note**: If the given graph contains cycles (checked with [isCyclic](#isCyclic)), an error will be thrown.

Also see:

- [descendants](#descendants)
- [parents](#parents)

### children

```ts
declare const children: (graph: Graph, vertex: string) => Set<string>;
```

Returns all the vertices that are children of the given vertex (i.e. there is an edge starting at the given vertex going to the child vertex).

**Note**: If there is an edge that both starts and ends at the given vertex, it will be considered a child of itself and included in the result.

Also see:

- [parents](#parents)
- [descendants](#descendants)

### clone

```ts
declare const clone: (graph: Graph) => Graph;
```

Creates a copy of the graph.

### create

```ts
declare const create: (size?: number, id?: (i: number) => string) => Graph;
```

Creates a new graph. The new graph can be seeded with an optional number of vertices, but it will not contain any edges.

The `size` argument defines how many vertices with which to seed the graph. Additional vertices can be added using [addVertex](#addVertex), but it is more efficient to create them upfront when possible.

The `id` function can be provided to specify the identity of each vertex. The `i` argument passed is a unique monotonically increasing integer for each vertex being created and by default it will simply be converted to a string (`(i) => i.toString(10)`) resulting in the sequence `"0"`, `"1"`, `"2"` etc.

To create a graph using existing ID's you can use a pattern like this:

```js
const users = [
  { id: "412", name: "Jane" },
  { id: "34", name: "Kate" },
  { id: "526", name: "Mike" },
  { id: "155", name: "Tony" },
];

const graph = create(users.length, (i) => users[i].id);
```

### degree

```ts
declare const degree: (graph: Graph, vertex: string, weighted?: boolean) => number;
```

Returns the [degree](<https://en.wikipedia.org/wiki/Degree_(graph_theory)>) for the given vertex.

By default `weighted` is `false`, if set to `true` the result will be the sum of the edge weights (which could be zero or a negative value).

Also see:

- [indegree](#indegree)
- [outdegree](#outdegree)

### descendants

```ts
declare const descendants: (graph: Graph, vertex: string) => Set<string>;
```

Given a [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph), returns all descendants of the given vertex (i.e. vertices to which there is a directed path from the given vertex).

**Note**: If the given graph contains cycles (checked with [isCyclic](#isCyclic)), an error will be thrown.

Also see:

- [ancestors](#ancestors)
- [children](#children)

### edges

```ts
declare const edges: (graph: Graph) => Set<Edge>;
```

Returns all the edges in the graph (i.e. any edge with a value other than `0`).

### fromD3

```ts
declare const fromD3: (graph: D3Graph) => Graph;
```

Converts a graph from a [D3Graph](#D3Graph) representation into a [Graph](#Graph) representation.

When the D3Graph contains multiple links between two nodes the resulting graph will have inflated edge weights to reflect that.

```js
const graph = fromD3({
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }],
  links: [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "A", target: "C" },
  ],
});
//=> Graph { "A" -> "B", "A" -> "C" }

getEdge(["A", "B"]);
//=> 1
getEdge(["A", "C"]);
//=> 2
```

**Note**: Any extraneous data associated with nodes or links in the D3Graph representation will be ignored.

Also see:

- [toD3](#toD3)

### getEdge

```ts
declare const getEdge: (graph: Graph, [u, v]: Edge) => number;
```

Get the weight of the given edge.

Also see:

- [addEdge](#addEdge)
- [removeEdge](#removeEdge)
- [setEdge](#setEdge)

### indegree

```ts
declare const indegree: (graph: Graph, vertex: string, weighted?: boolean) => number;
```

Returns the [indegree](https://en.wikipedia.org/wiki/Indegree) for the given vertex.

By default `weighted` is `false`, if set to `true` the result will be the sum of the edge weights (which could be zero or a negative value).

Also see:

- [degree](#degree)
- [outdegree](#outdegree)

### isCyclic

```ts
declare const isCyclic: (graph: Graph) => boolean;
```

Returns `true` if the graph provided contains any [cycles](<https://en.wikipedia.org/wiki/Cycle_(graph_theory)>) (including "loops" — when an edge that starts and ends at the same vertex), otherwise returns `false`.

### isUndirected

```ts
declare const isUndirected: (graph: Graph) => boolean;
```

Returns `true` if the graph can be considered an [undirected graph](https://mathinsight.org/definition/undirected_graph) — every edge in the graph (from vertex A to B) has a mutual edge (from vertex B to A) with an equal weight. Loops are considered bidirectional and are allow in a undirected graph.

```js
let graph = create(2, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B" }

isUndirected(graph);
//=> true

graph = addEdge(graph, ["A", "B"]);
//=> Graph { "A" -> "B" }

isUndirected(graph);
//=> false

graph = addEdge(graph, ["B", "A"]);
//=> Graph { "A" <-> "B" }

isUndirected(graph);
//=> true
```

### makeUndirected

```ts
declare const makeUndirected: (graph: Graph, merge?: (a: number, b: number) => number) => Graph;
```

Converts a directed graph to an undirected graph by either adding edges to make them mutual or balancing the weights of mutual edges that aren't already equal.

The `merge` function is used to determine the weight of edges in cases where mutual edges with differing weights already exist. If not provide the default method is to use the highest of the two edge weights (`(a, b) => Math.max(a, b)`).

```js
let graph = create(3, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B", "C" }

graph = addEdge(graph, ["A", "B"]);
//=> Graph { "A" -> "B", "C" }

graph = makeUndirected(graph);
//=> Graph { "A" <-> "B", "C" }
```

### order

```ts
declare const order: (graph: Graph) => number;
```

Returns the number of vertices in the graph.

```js
let graph = create(3, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B", "C" }

order(graph);
//=> 3
```

Also see:

- [size](#size)

### outdegree

```ts
declare const outdegree: (graph: Graph, vertex: string, weighted?: boolean) => number;
```

Returns the [outdegree](https://en.wikipedia.org/wiki/Outdegree) for the given vertex.

By default `weighted` is `false`, if set to `true` the result will be the sum of the edge weights (which could be zero or a negative value).

Also see:

- [degree](#degree)
- [indegree](#indegree)

### parents

```ts
declare const parents: (graph: Graph, vertex: string) => Set<string>;
```

Returns all the vertices that are parents of the given vertex (i.e. there is an edge starting at the parent vertex going to the given vertex).

**Note**: If there is an edge that both starts and ends at the given vertex, it will be considered a parent of itself and included in the result.

Also see:

- [ancestors](#ancestors)
- [children](#children)

### removeEdge

```ts
declare const removeEdge: (graph: Graph, edge: Edge) => Graph;
```

Removes an edge from a graph.

**Note**: `removeEdge(graph, edge)` is equivalent to `setEdge(graph, edge, 0)`.

```js
let graph = create(3, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B", "C" }

graph = addEdge(graph, ["A", "B"]);
//=> Graph { "A" -> "B", "C" }

graph = removeEdge(graph, ["A", "B"]);
//=> Graph { "A", "B", "C" }
```

Also see:

- [addEdge](#addEdge)
- [getEdge](#getEdge)
- [setEdge](#setEdge)

### removeVertex

```ts
declare const removeVertex: (graph: Graph, vertex: string) => Graph;
```

Removes a vertex from a graph.

Also see:

- [addVertex](#addVertex)

### setEdge

```ts
declare const setEdge: (graph: Graph, [u, v]: Edge, weight: number) => Graph;
```

Set the weight of the given edge.

**Note**: `setEdge(graph, edge, 1)` is equivalent to `addEdge(graph, edge)` and `setEdge(graph, edge, 0)` is equivalent to `removeEdge(graph, edge)`.

```js
let graph = create(3, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B", "C" }

graph = setEdge(graph, ["A", "B"], 1);
//=> Graph { "A" -> "B", "C" }

graph = setEdge(graph, ["A", "B"], 0);
//=> Graph { "A", "B", "C" }
```

Also see:

- [addEdge](#addEdge)
- [getEdge](#getEdge)
- [removeEdge](#removeEdge)

### size

```ts
declare const size: (graph: Graph) => number;
```

Returns the number of edges in the graph.

```js
let graph = create(3, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B", "C" }

graph = addEdge(graph, ["A", "B"]);
//=> Graph { "A" -> "B", "C" }

graph = addEdge(graph, ["B", "C"]);
//=> Graph { "A" -> "B", "B" -> "C" }

size(graph);
//=> 2
```

Also see:

- [order](#order)

### toD3

```ts
declare const toD3: (graph: Graph) => D3Graph;
```

Converts a graph from a [Graph](#Graph) representation into a [D3Graph](#D3Graph) representation.

Edges with a weight of 2 or greater will result in multiple links being generated in the D3Graph.

```js
let graph = create(3, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B", "C" }

graph = setEdge(graph, ["A", "B"], 1);
//=> Graph { "A" -> "B", "C" }

graph = setEdge(graph, ["A", "C"], 2);
//=> Graph { "A" -> "B", "A" -> "C" }

toD3(graph);
//=> {
//     nodes: [{ id: "A" }, { id: "B" }, { id: "C" }],
//     links: [
//       { source: "A", target: "B" },
//       { source: "A", target: "C" },
//       { source: "A", target: "C" },
//     ],
//   }
```

Also see:

- [fromD3](#fromD3)

### topologicalSort

```ts
declare const topologicalSort: (graph: Graph) => Array<string>;
```

Given a [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph), returns an array of the graph's vertices sorted using a [topological sort](https://en.wikipedia.org/wiki/Topological_sorting).

**Note**: If the given graph contains cycles (checked with [isCyclic](#isCyclic)), an error will be thrown.

```js
let graph = create(3, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B", "C" }

graph = addEdge(graph, ["A", "C"]);
//=> Graph { "A" -> "C", "B" }

graph = addEdge(graph, ["C", "B"]);
//=> Graph { "A" -> "C", "C" -> "B" }

topologicalSort(graph);
//=> ["A", "C", "B"]
```

### transpose

```ts
declare const transpose: (graph: Graph) => Graph;
```

Flips the orientation of all edges in a directed graph.

```js
let graph = create(3, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B", "C" }

graph = addEdge(graph, ["A", "B"]);
//=> Graph { "A" -> "B", "C" }

graph = addEdge(graph, ["B", "C"]);
//=> Graph { "A" -> "B", "B" -> "C" }

transpose(graph);
//=> Graph { "B" -> "A", "C" -> "B" }
```

### vertices

```ts
declare const vertices: (graph: Graph) => Set<string>;
```

Returns the vertices in the graph.

### vertexPairs

```ts
declare const vertexPairs: (graph: Graph) => Set<[string, string]>;
```

Returns a list of all pairs of vertices in the graph irrespective of the edges present in the graph.

```js
let graph = create(3, (i) => String.fromCharCode(65 + i));
//=> Graph { "A", "B", "C" }

vertexPairs(graph);
//=> Set { ["A", "A"], ["A", "B"], ["A", "C"], ["B", "B"], ["B", "C"], ["C", "C"] }
```
