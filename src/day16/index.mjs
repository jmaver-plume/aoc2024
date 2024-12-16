import fs from "node:fs";
import {
  Direction,
  findUniqueInGrid,
  getNextPosition,
  parseGridInput,
  printGrid,
  shallowCloneGrid,
} from "../util.mjs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return parseGridInput(data);
}

const Tile = {
  Start: "S",
  End: "E",
  Wall: "#",
  Empty: ".",
};

function rotateLeft(direction) {
  switch (direction) {
    case Direction.Up:
      return Direction.Left;
    case Direction.Left:
      return Direction.Down;
    case Direction.Down:
      return Direction.Right;
    case Direction.Right:
      return Direction.Up;
    default:
      throw new Error(`Invalid direction ${direction}.`);
  }
}

function rotateRight(direction) {
  switch (direction) {
    case Direction.Up:
      return Direction.Right;
    case Direction.Right:
      return Direction.Down;
    case Direction.Down:
      return Direction.Left;
    case Direction.Left:
      return Direction.Up;
    default:
      throw new Error(`Invalid direction ${direction}.`);
  }
}

function solver(position, direction, cost, visited, cache, grid) {
  const key = `${position.x}::${position.y}::${direction}`;
  if (cache.has(key)) {
    return cache.get(key);
  }

  // We returned to original path
  if (visited.has(key)) {
    return { cost: Infinity, visited: new Set(visited) };
  }

  const nextPosition = getNextPosition(position, direction);
  if (grid[nextPosition.y][nextPosition.x] === Tile.End) {
    const clonedVisited = new Set(visited);
    clonedVisited.add(key);
    return { cost: cost + 1, visited: clonedVisited };
  }

  const possibilities = [];
  if (grid[nextPosition.y][nextPosition.x] === Tile.Empty) {
    const clonedVisited = new Set(visited);
    clonedVisited.add(key);
    possibilities.push(
      solver(nextPosition, direction, cost + 1, clonedVisited, cache, grid),
    );
  }

  const rotateLeftVisited = new Set(visited);
  rotateLeftVisited.add(key);
  possibilities.push(
    solver(
      position,
      rotateLeft(direction),
      cost + 1000,
      rotateLeftVisited,
      cache,
      grid,
    ),
  );

  const rotateRightVisited = new Set(visited);
  rotateRightVisited.add(key);
  possibilities.push(
    solver(
      position,
      rotateRight(direction),
      cost + 1000,
      rotateRightVisited,
      cache,
      grid,
    ),
  );

  possibilities.sort((a, b) => a.cost - b.cost);
  cache.set(key, possibilities[0]);
  return cache.get(key);
}

function print(visited, grid) {
  const clonedGrid = shallowCloneGrid(grid);
  [...visited]
    .map((value) => {
      const [x, y, direction] = value.split("::");
      return {
        position: {
          x: parseInt(x),
          y: parseInt(y),
        },
        direction,
      };
    })
    .forEach(({ position, direction }) => {
      clonedGrid[position.y][position.x] = direction;
    });
  printGrid(clonedGrid);
}

function solvePart1() {
  const grid = parseInput();
  const start = findUniqueInGrid((value) => value === Tile.Start, grid);
  const cache = new Map();
  const result = solver(start, Direction.Right, 0, new Set(), cache, grid);
  print(result.visited, grid);
  return result;
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
