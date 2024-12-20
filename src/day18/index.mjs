import fs from "node:fs";
import {
  createEmptyGrid,
  getGridNeighbours,
  makeGridIterator,
  positionToString,
  printGrid,
  PriorityQueue,
  stringToPosition,
} from "../util.mjs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line) => ({
    x: parseInt(line.split(",")[0]),
    y: parseInt(line.split(",")[1]),
  }));
}

function solvePart1() {
  const bytes = parseInput();
  const grid = createEmptyGrid(7, 7, ".");
  bytes.slice(0, 12).forEach((byte) => {
    grid[byte.y][byte.x] = "#";
  });

  // Solve using Dijkstra
  const pq = new PriorityQueue();
  const dist = {};
  const prev = {};

  // Assign distance to every node
  for (const { x, y, value } of makeGridIterator(grid)) {
    if (value === "#") {
      continue;
    }
    const key = positionToString({ x, y });
    const distance = x === 0 && y === 0 ? 0 : Infinity;
    dist[key] = distance;
    pq.add(key, distance);
  }

  while (!pq.isEmpty()) {
    const u = pq.extractMin();
    const position = stringToPosition(u);
    const neighbours = getGridNeighbours(position, grid)
      .filter((neighbour) => {
        return grid[neighbour.y][neighbour.x] !== "#";
      })
      .map((neighbour) => positionToString(neighbour));
    neighbours.forEach((neighbour) => {
      const alt = dist[u] + 1;
      if (alt < dist[neighbour]) {
        prev[neighbour] = u;
        dist[neighbour] = alt;
        pq.decreasePriority(neighbour, alt);
      }
    });
  }

  const end = positionToString({ x: 6, y: 6 });
  return dist[end];
}

function solvePart2() {
  const input = parseInput();
  return;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
