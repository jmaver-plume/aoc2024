import fs from "node:fs";
import { Edge, Graph, Node, toDot } from "ts-graphviz";
import clipboard from "clipboardy";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line) => line.split("-"));
}

function createGraphFromInput(input) {
  const graph = {};
  input.forEach((edge) => {
    const [left, right] = edge;
    if (!graph[left]) {
      graph[left] = new Set();
    }
    if (!graph[right]) {
      graph[right] = new Set();
    }
    graph[left].add(right);
    graph[right].add(left);
  });
  return graph;
}

function solvePart1() {
  const input = parseInput();
  const graph = createGraphFromInput(input);

  const results = new Set();
  Object.entries(graph).forEach((entry) => {
    const [node, edges] = entry;
    const edgesArr = Array.from(edges);
    const combinations = [];
    for (let i = 0; i < edgesArr.length; i++) {
      for (let j = i + 1; j < edgesArr.length; j++) {
        combinations.push([edgesArr[i], edgesArr[j]]);
      }
    }
    combinations.forEach((combination) => {
      const [left, right] = combination;
      if (graph[left].has(right)) {
        const list = [node, left, right].sort();
        if (list.some((item) => item.startsWith("t"))) {
          results.add(list.join(","));
        }
      }
    });
  });

  return results.size;
}

function solvePart2() {
  const input = parseInput();
  const graph = createGraphFromInput(input);

  // Greedy algorithm for finding maximal clique:
  //   - https://en.wikipedia.org/wiki/Clique_problem#Finding_a_single_maximal_clique
  const cliques = {};
  Object.entries(graph).forEach((entry) => {
    const [node, edges] = entry;
    const clique = new Set([node]);
    edges.forEach((edge) => {
      if (Array.from(clique).every((item) => graph[item].has(edge))) {
        clique.add(edge);
      }
    });
    cliques[node] = clique;
  });

  let maxClique;
  for (const key in cliques) {
    const clique = cliques[key];
    if (!maxClique || maxClique.size < clique.size) {
      maxClique = clique;
    }
  }
  return Array.from(maxClique).sort().join(",");
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
