import fs from "node:fs";
import {
  findUniqueInGrid,
  getGridNeighbours,
  makeGridIterator,
  parseGridInput,
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
  return parseGridInput(data);
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
    const distance = x === start.x && y === start.y ? 0 : Infinity;
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

function reconstructPaths(prev, start, end) {
  const path = [];
  while (end !== start) {
    path.push(end);
    end = prev[end];
  }
  return path;
}

function solvePart1() {
  const grid = parseInput();
  const start = findUniqueInGrid((value) => value === "S", grid);
  const end = findUniqueInGrid((value) => value === "E", grid);
  const { dist, prev } = getShortestPath(start, grid);
  const path = reconstructPaths(
    prev,
    positionToString(start),
    positionToString(end),
  );

  const locationToIndex = {};
  path.forEach((location, index) => {
    locationToIndex[location] = index;
  });

  const cheats = []
  path.forEach((location) => {
    // 4 directions
    // right
    const index = locationToIndex[location];
    const position = stringToPosition(location);
    if (position.x < grid[0].length - 2) {
      const nextPosition = { x: position.x + 1, y: position.y };
      const nextNextPosition = { x: position.x + 2, y: position.y };
      const next = grid[nextPosition.y][nextPosition.x];
      const nextNext = grid[nextNextPosition.y][nextNextPosition.x];
      const cheatIndex = locationToIndex[positionToString(nextNextPosition)];
      if (next === "#" && nextNext === "." && index < cheatIndex) {
        cheats.push(cheatIndex - index - 2)
      }
    }

    if (position.x > 1) {
      const nextPosition = { x: position.x - 1, y: position.y };
      const nextNextPosition = { x: position.x - 2, y: position.y };
      const next = grid[nextPosition.y][nextPosition.x];
      const nextNext = grid[nextNextPosition.y][nextNextPosition.x];
      const cheatIndex = locationToIndex[positionToString(nextNextPosition)];
      if (next === "#" && nextNext === "." && index < cheatIndex) {
        cheats.push(cheatIndex - index - 2)
      }
    }

    if (position.y < grid.length - 2) {
      const nextPosition = { x: position.x, y: position.y + 1 };
      const nextNextPosition = { x: position.x, y: position.y + 2 };
      const next = grid[nextPosition.y][nextPosition.x];
      const nextNext = grid[nextNextPosition.y][nextNextPosition.x];
      const cheatIndex = locationToIndex[positionToString(nextNextPosition)];
      if (next === "#" && nextNext === "." && index < cheatIndex) {
        cheats.push(cheatIndex - index - 2)
      }
    }

    if (position.y > 1) {
      const nextPosition = { x: position.x, y: position.y - 1 };
      const nextNextPosition = { x: position.x, y: position.y - 2 };
      const next = grid[nextPosition.y][nextPosition.x];
      const nextNext = grid[nextNextPosition.y][nextNextPosition.x];
      const cheatIndex = locationToIndex[positionToString(nextNextPosition)];
      if (next === "#" && nextNext === "." && index < cheatIndex) {
        cheats.push(cheatIndex - index - 2)
      }
    }
  });

  // for each location in path search for +2 neighbours
  // if +2 neighbour is also path location and said path location index is after path location index then it's an improvement else it's not

  return cheats.filter(cheat => cheat >= 100).length;
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
