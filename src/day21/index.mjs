import fs from "node:fs";
import {
  equalsPosition,
  getGridNeighbours,
  makeGridIterator,
  positionToString,
  PriorityQueue,
  stringToPosition,
} from "../util.mjs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n");
}

function getShortestPath(start, end, grid) {
  // Solve using Dijkstra
  const pq = new PriorityQueue();
  const dist = {};
  const prev = {};

  // Assign distance to every node
  for (const { x, y, value } of makeGridIterator(grid)) {
    if (value === null) {
      continue;
    }
    const position = { x, y };
    const key = positionToString(position);
    const distance = equalsPosition(position, start) ? 0 : Infinity;
    dist[key] = distance;
    pq.add(key, distance);
  }

  while (!pq.isEmpty()) {
    const u = pq.extractMin();
    const position = stringToPosition(u);
    if (equalsPosition(position, end)) {
      break;
    }
    const neighbours = getGridNeighbours(position, grid)
      .filter((n) => grid[n.y][n.x] !== null)
      .map((n) => positionToString(n));
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

function getMoves(path) {
  const moves = [];
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const now = path[i];
    if (prev.x !== now.x) {
      moves.push(prev.x > now.x ? "<" : ">");
    } else {
      moves.push(prev.y > now.y ? "^" : "v");
    }
  }
  return moves;
}

function reconstructPath(start, end, prev) {
  const path = [end];
  let current = end;
  while (!equalsPosition(current, start)) {
    const p = stringToPosition(prev[positionToString(current)]);
    path.unshift(p);
    current = p;
  }
  return path;
}

class NumericKeypad {
  constructor() {
    this.items = [
      [7, 8, 9],
      [4, 5, 6],
      [1, 2, 3],
      [null, 0, "A"],
    ];

    this.position = { x: 2, y: 3 };
  }

  press(value) {
    const end = this.findPosition(value);
    const { dist, prev } = getShortestPath(this.position, end, this.items);
    const path = reconstructPath(this.position, end, prev);
    const moves = getMoves(path);
    this.position = end;
    return moves;
  }

  findPosition(value) {
    switch (value) {
      case 0:
        return { x: 1, y: 3 };
      case "A":
        return { x: 2, y: 3 };
      case 1:
        return { x: 0, y: 2 };
      case 2:
        return { x: 1, y: 2 };
      case 3:
        return { x: 2, y: 2 };
      case 4:
        return { x: 0, y: 1 };
      case 5:
        return { x: 1, y: 1 };
      case 6:
        return { x: 2, y: 1 };
      case 7:
        return { x: 0, y: 0 };
      case 8:
        return { x: 1, y: 0 };
      case 9:
        return { x: 2, y: 0 };
      default:
        throw new Error(`Invalid value ${value}.`);
    }
  }
}

class DirectionalKeypad {
  constructor() {
    this.items = [
      [null, "^", "A"],
      ["<", "v", ">"],
    ];

    this.x = 2;
    this.y = 0;
  }
}

function solvePart1() {
  const codes = parseInput();
  const numericKeypad = new NumericKeypad();
  console.log(numericKeypad.press(4));
  console.log(numericKeypad.press(3));
  console.log(numericKeypad.press(7));
  console.log(numericKeypad.press(0));
  return;
}

function solvePart2() {
  const codes = parseInput();
  return;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
