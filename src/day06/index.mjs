import fs from "node:fs";
import { isOnGridEdge, makeGridIterator, shallowCloneGrid } from "../util.mjs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line) => line.split(""));
}

// Problem specific methods
function getStart(grid) {
  const gridIterator = makeGridIterator(grid);
  for (const { x, y, value } of gridIterator) {
    if (value === "^") {
      return { x, y, direction: "^" };
    }
  }
}

// Either moves guard to the next position or rotates the guards direction
function move(guard, grid) {
  // Calculate next possible position of the guard
  let nextPosition;
  switch (guard.direction) {
    case "^":
      nextPosition = { x: guard.x, y: guard.y - 1 };
      break;
    case ">":
      nextPosition = { x: guard.x + 1, y: guard.y };
      break;
    case "v":
      nextPosition = { x: guard.x, y: guard.y + 1 };
      break;
    case "<":
      nextPosition = { x: guard.x - 1, y: guard.y };
      break;
    default:
      throw new Error(`Cannot rotate direction "${guard.direction}"`);
  }

  if (grid[nextPosition.y][nextPosition.x] !== "#") {
    // Go forward since there is no obstacle
    guard.x = nextPosition.x;
    guard.y = nextPosition.y;
  } else {
    // If next position is an obstacle we need to rotate the guards direction
    switch (guard.direction) {
      case "^":
        guard.direction = ">";
        break;
      case ">":
        guard.direction = "v";
        break;
      case "v":
        guard.direction = "<";
        break;
      case "<":
        guard.direction = "^";
        break;
      default:
        throw new Error(`Cannot rotate direction "${guard.direction}"`);
    }
  }
}

function solvePart1() {
  const grid = parseInput();
  const guard = getStart(grid);
  // Mark initial position as visited
  grid[guard.y][guard.x] = "X";
  do {
    move(guard, grid);
    grid[guard.y][guard.x] = "X";
  } while (!isOnGridEdge(guard, grid));
  return grid.flat().reduce((sum, value) => (value === "X" ? sum + 1 : sum), 0);
}

function solvePart2() {
  const grid = parseInput();

  // First run without an additional obstacle to get a list of locations guard visited
  // This is a performance optimization to add obstacle to only visited locations
  const firstClone = shallowCloneGrid(grid);
  const guard = getStart(firstClone);
  firstClone[guard.y][guard.x] = "X";
  do {
    move(guard, firstClone);
    firstClone[guard.y][guard.x] = "X";
  } while (!isOnGridEdge(guard, firstClone));

  let count = 0;
  const gridIterator = makeGridIterator(grid);
  for (const { x, y, value } of gridIterator) {
    // Add obstacle to locations guard visited
    if (firstClone[y][x] === "X" && value === ".") {
      const guard = getStart(grid);

      // Add obstacle
      grid[y][x] = "#";

      const visited = new Set();
      do {
        // Position and direction are used as key for loop finding
        const key = `${guard.x}::${guard.y}::${guard.direction}`;
        if (visited.has(key)) {
          // Location with direction already visited indicating a loop
          count += 1;
          break;
        }
        // Location with direction not yet visited
        visited.add(key);
        move(guard, grid);
      } while (!isOnGridEdge(guard, grid));

      // Remove obstacle
      grid[y][x] = ".";
    }
  }
  return count;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
