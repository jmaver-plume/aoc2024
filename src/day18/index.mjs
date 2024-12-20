import fs from "node:fs";
import {
  createEmptyGrid,
  getGridNeighbours,
  makeGridIterator,
  positionToString,
  PriorityQueue,
  shallowCloneGrid,
  stringToPosition,
} from "../util.mjs";

function getInputFile() {
  return process.env.INPUT ?? "sample.txt";
}

function isSample() {
  const inputFile = getInputFile();
  return inputFile === "sample.txt";
}

function readInput() {
  const inputFile = getInputFile();
  return fs.readFileSync(new URL(inputFile, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line) => ({
    x: parseInt(line.split(",")[0]),
    y: parseInt(line.split(",")[1]),
  }));
}

function getShortestPath(start, grid) {
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

  return { dist, prev };
}

function solvePart1() {
  const size = isSample() ? 7 : 71;
  const duration = isSample() ? 12 : 1024;

  const bytes = parseInput();
  const grid = createEmptyGrid(size, size, ".");
  bytes.slice(0, duration).forEach((byte) => {
    grid[byte.y][byte.x] = "#";
  });

  const { dist, prev } = getShortestPath({ x: 0, y: 0 }, grid);
  const end = positionToString({ x: size - 1, y: size - 1 });
  return dist[end];
}

function solvePart2() {
  const bytes = parseInput();

  const size = isSample() ? 7 : 71;
  const minDuration = isSample() ? 12 : 1024;
  const interval = isSample()
    ? [13, bytes.length - 1]
    : [1025, bytes.length - 1];
  const grid = createEmptyGrid(size, size, ".");

  // [1, 4] -> 2 -> [1] and [3, 4]
  // [1, 3] -> 2 -> [1] and [3]
  while (interval[0] !== interval[1] && interval[0] + 1 !== interval[1]) {
    const middle = Math.floor((interval[0] + interval[1]) / 2);
    const clone = shallowCloneGrid(grid);
    for (let i = 0; i <= middle; i++) {
      const byte = bytes[i];
      clone[byte.y][byte.x] = "#";
    }
    const { dist, prev } = getShortestPath({ x: 0, y: 0 }, clone);
    const end = positionToString({ x: size - 1, y: size - 1 });
    if (dist[end] === Infinity) {
      interval[1] = middle;
    } else {
      interval[0] = middle;
    }
  }

  const byte = bytes[interval[1]];
  return `${byte.x},${byte.y}`;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
