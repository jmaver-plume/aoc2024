import fs from "node:fs";
import {
  equalsPosition,
  findUniqueInGrid,
  getGridNeighbours,
  isInsideGrid,
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

function findPath(grid) {
  const start = findUniqueInGrid((value) => value === "S", grid);
  const end = findUniqueInGrid((value) => value === "E", grid);
  const path = [start];
  const visited = new Set([positionToString(start)]);
  let current = start;
  while (!equalsPosition(current, end)) {
    const next = getGridNeighbours(current, grid).find(
      (p) => grid[p.y][p.x] !== "#" && !visited.has(positionToString(p)),
    );
    path.push(next);
    current = next;
    visited.add(positionToString(next));
  }
  return path;
}

/**
 * @param {{ x: number; y: number }} a
 * @param {{ x: number; y: number }} b
 * @returns {number}
 */
function getManhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbours(position, maxDistance, grid) {
  const neighbours = [];
  for (let y = position.y - maxDistance; y <= position.y + maxDistance; y++) {
    for (let x = position.x - maxDistance; x <= position.x + maxDistance; x++) {
      const candidate = { x, y };
      const manhattanDistance = getManhattanDistance(candidate, position);
      if (
        isInsideGrid(candidate, grid) &&
        manhattanDistance <= maxDistance &&
        grid[candidate.y][candidate.x] !== "#"
      ) {
        neighbours.push(candidate);
      }
    }
  }
  return neighbours;
}

function solvePart1() {
  const grid = parseInput();
  const path = findPath(grid);

  const locationToIndex = {};
  path.forEach((position, index) => {
    locationToIndex[positionToString(position)] = index;
  });

  const cheats = [];
  path.forEach((position) => {
    const index = locationToIndex[positionToString(position)];
    const neighbours = getNeighbours(position, 2, grid);
    neighbours.forEach((neighbour) => {
      const neighbourIndex = locationToIndex[positionToString(neighbour)];
      if (index < neighbourIndex) {
        cheats.push(neighbourIndex - index - 2);
      }
    });
  });
  return cheats.filter((cheat) => cheat >= 100).length;
}

function solvePart2() {
  const grid = parseInput();
  const path = findPath(grid);

  const locationToIndex = {};
  path.forEach((position, index) => {
    locationToIndex[positionToString(position)] = index;
  });

  const cheats = [];
  path.forEach((position) => {
    const index = locationToIndex[positionToString(position)];
    const neighbours = getNeighbours(position, 20, grid);
    neighbours.forEach((neighbour) => {
      const neighbourIndex = locationToIndex[positionToString(neighbour)];
      if (index < neighbourIndex) {
        const key = `${position.x}:${position.y}::${neighbour.x}:${neighbour.y}`;
        const distance = getManhattanDistance(position, neighbour);
        cheats.push(neighbourIndex - index - distance);
      }
    });
  });

  return Object.entries(cheats).filter((entry) => entry[1] >= 100).length;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
