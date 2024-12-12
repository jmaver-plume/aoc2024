import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line) => line.split(""));
}

// Generic grid methods
// Returns a grid iterator for use in for...of
function* makeGridIterator(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      yield { x, y, value: grid[y][x], grid };
    }
  }
}

/**
 * Returns stringified representation of a position.
 *
 * @param {{ x: number, y: number }} position
 * @returns {string}
 */
function positionToString(position) {
  return `${position.x}::${position.y}`;
}

function stringToPosition(string) {
  const [x, y] = string.split("::");
  return { x: parseInt(x), y: parseInt(y) };
}

/**
 * Returns the value on grid at position.
 *
 * @param {{ x: number, y: number }} position
 * @param {string[][]} grid
 * @returns {string}
 */
function getPositionValue(position, grid) {
  return grid[position.y][position.x];
}

/**
 * Returns all neighbours (including diagonal) for a position in a grid
 *
 * @param {{ x: number, y: number }} position
 * @param {string[][]} grid
 * @returns {{ x: number, y: number }[]}
 */
function getNeighbours(position, grid) {
  const maxX = grid[0].length - 1;
  const maxY = grid.length - 1;
  const neighbours = [];
  if (position.x !== 0) {
    neighbours.push({ x: position.x - 1, y: position.y });
  }
  if (position.x !== maxX) {
    neighbours.push({ x: position.x + 1, y: position.y });
  }
  if (position.y !== 0) {
    neighbours.push({ x: position.x, y: position.y - 1 });
  }
  if (position.y !== maxY) {
    neighbours.push({ x: position.x, y: position.y + 1 });
  }
  return neighbours;
}

function solvePart1() {
  const grid = parseInput();
  const maxX = grid[0].length - 1;
  const maxY = grid.length - 1;
  let result = 0;
  const visitedPositions = new Set();
  for (const { x, y, value } of makeGridIterator(grid)) {
    const position = { x, y };
    const positionString = positionToString(position);
    if (visitedPositions.has(positionString)) {
      continue;
    }

    // Calculate region
    const visitedRegionPositions = new Set();
    const queue = [position];
    while (queue.length) {
      const first = queue.shift();
      const firstKey = positionToString(first);
      if (visitedRegionPositions.has(firstKey)) {
        continue;
      }
      visitedRegionPositions.add(firstKey);
      const neighbours = getNeighbours(first, grid).filter(
        (position) => getPositionValue(position, grid) === value,
      );
      queue.push(...neighbours);
    }

    let regionPerimeter = 0;
    [...visitedRegionPositions]
      .map((string) => stringToPosition(string))
      .forEach((position) => {
        // Boundary perimeters
        if (position.x === 0) {
          regionPerimeter += 1;
        }
        if (position.y === 0) {
          regionPerimeter += 1;
        }
        if (position.x === maxX) {
          regionPerimeter += 1;
        }
        if (position.y === maxY) {
          regionPerimeter += 1;
        }

        // Add neighbour parameters
        regionPerimeter += getNeighbours(position, grid).filter(
          (position) => getPositionValue(position, grid) !== value,
        ).length;

        visitedPositions.add(positionToString(position))
      });

    result += visitedRegionPositions.size * regionPerimeter;
  }
  return result;
}

function solvePart2() {
  const grid = parseInput();
  return;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
