<div align="center">
  <h1>
    <img src="logo.png" alt="graph-fns" width="160" />
  </h1>
  <p>A utility library for working with graphs.</p>
  <p>
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/graph-fns.svg">
    <img alt="npm" src="https://img.shields.io/npm/dw/graph-fns.svg">
  </p>
</div>

## Features

- Flow and TypeScript declarations included.
- CommonJS, UMD and ESM modules provided.
- Zero dependencies.

## Installation

Yarn:

```shell
yarn add graph-fns
```

NPM:

```shell
npm install graph-fns
```

## Usage

```js
import { isCyclic, fromD3 } from "graph-fns";

const graphA = fromD3({
  nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
  links: [
    { source: "a", target: "b" },
    { source: "b", target: "c" },
  ],
});

const graphB = fromD3({
  nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
  links: [
    { source: "a", target: "b" },
    { source: "b", target: "c" },
    { source: "c", target: "a" },
  ],
});

isCyclic(graphA); // false
isCyclic(graphB); // true
```

## API

### isCyclic

```ts
declare const isCyclic: (graph: Graph) => boolean;
```

Returns `true` if the graph provided contains any cycles (this includes "loops" — an edge that starts and ends at the same vertex), otherwise returns `false`.

### topologicalSort

```ts
declare const topologicalSort: (graph: Graph) => Array<number>;
```

Given a [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph), returns an array of the graph's vertices sorted using a [topological sort](https://en.wikipedia.org/wiki/Topological_sorting).

### fromD3

```ts
declare const fromD3: (graph: D3Graph) => Graph;
```

Converts a graph from a representation that is convinient for using with [D3.js force-directed graphs](https://github.com/d3/d3-force) into the representation that _graph-fns_ uses.

**Note**: Currently, this is a lossy process. All ID's will be lost along with any "metadata" associated with nodes or links.

### toD3

```ts
declare const toD3: (graph: Graph) => D3Graph;
```

Converts a graph from the representation _graph-fns_ uses into a representation that is convinient for using with [D3.js force-directed graphs](https://github.com/d3/d3-force).

**Note**: This function will generate ID's — it will not use any ID's that may have been provided in an eariler call to `fromD3()`.

## Types

### Graph

```ts
declare type Graph = {
  size: number;
  adjacencyMatrix: Array<Array<number>>;
};
```

This is the representation of a graph that _graph-fns_ uses. It includes an [adjacency matrix](https://en.wikipedia.org/wiki/Adjacency_matrix) to describe the number of edges between each vertex (i.e. a value of `0` indicates there is no edge between the two vertices and a value of `1` indicates there's a single edge connecting them).

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

This representation of a graph is convinient for using with [D3.js force-directed graphs](https://github.com/d3/d3-force).

## Roadmap

1.  Allow arbitrary data associated with nodes and links that can be preserved when converting between `Graph` and `D3Graph` objects.
2.  Better docs with visualisations to explain the concepts for anyone not familiar with graph theory.
3.  Edge weights.
4.  More helpful functions!
