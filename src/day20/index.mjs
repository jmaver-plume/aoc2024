import fs from "node:fs";
import {
  equalsPosition,
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

function findPath(grid) {
  const start = findUniqueInGrid((value) => value === "S", grid);
  const end = findUniqueInGrid((value) => value === "E", grid);
  const path = [positionToString(start)];
  const visited = new Set(path);
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
    const candidates = [];
    if (position.x < grid[0].length - 2) {
      candidates.push({
        position,
        nextPosition: { x: position.x + 1, y: position.y },
        nextNextPosition: { x: position.x + 2, y: position.y },
      });
    }
    if (position.x > 1) {
      candidates.push({
        position,
        nextPosition: { x: position.x - 1, y: position.y },
        nextNextPosition: { x: position.x - 2, y: position.y },
      });
    }
    if (position.y < grid.length - 2) {
      candidates.push({
        position,
        nextPosition: { x: position.x, y: position.y + 1 },
        nextNextPosition: { x: position.x, y: position.y + 2 },
      });
    }
    if (position.y > 1) {
      candidates.push({
        position,
        nextPosition: { x: position.x, y: position.y - 1 },
        nextNextPosition: { x: position.x, y: position.y - 2 },
      });
    }
    candidates.forEach((candidate) => {
      const { nextPosition, nextNextPosition } = candidate;
      const next = grid[nextPosition.y][nextPosition.x];
      const nextNext = grid[nextNextPosition.y][nextNextPosition.x];
      const cheatIndex = locationToIndex[positionToString(nextNextPosition)];
      if (next === "#" && nextNext === "." && index < cheatIndex) {
        cheats.push(cheatIndex - index - 2);
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
    const candidates = [];
    if (position.x < grid[0].length - 2) {
      candidates.push({
        position,
        nextPosition: { x: position.x + 1, y: position.y },
        nextNextPosition: { x: position.x + 2, y: position.y },
      });
    }
    if (position.x > 1) {
      candidates.push({
        position,
        nextPosition: { x: position.x - 1, y: position.y },
        nextNextPosition: { x: position.x - 2, y: position.y },
      });
    }
    if (position.y < grid.length - 2) {
      candidates.push({
        position,
        nextPosition: { x: position.x, y: position.y + 1 },
        nextNextPosition: { x: position.x, y: position.y + 2 },
      });
    }
    if (position.y > 1) {
      candidates.push({
        position,
        nextPosition: { x: position.x, y: position.y - 1 },
        nextNextPosition: { x: position.x, y: position.y - 2 },
      });
    }
    candidates.forEach((candidate) => {
      const { nextPosition, nextNextPosition } = candidate;
      const next = grid[nextPosition.y][nextPosition.x];
      const nextNext = grid[nextNextPosition.y][nextNextPosition.x];
      const cheatIndex = locationToIndex[positionToString(nextNextPosition)];
      if (next === "#" && nextNext === "." && index < cheatIndex) {
        cheats.push(cheatIndex - index - 2);
      }
    });
  });
  return cheats.filter((cheat) => cheat >= 100).length;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
