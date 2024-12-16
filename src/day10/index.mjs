import fs from "node:fs";
import { getGridNeighbours, makeGridIterator } from "../util.mjs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line) => line.split("").map(Number));
}

const Mountain = {
  Bottom: 0,
  Top: 9,
};

/**
 * Returns stringified representation of a position.
 *
 * @param {{ x: number, y: number }} position
 * @returns {string}
 */
function positionToString(position) {
  return `${position.x}::${position.y}`;
}

/**
 * Returns the value on grid at position.
 *
 * @param {{ x: number, y: number }} position
 * @param {number[][]} grid
 * @returns {number}
 */
function getPositionValue(position, grid) {
  return grid[position.y][position.x];
}

function solvePart1() {
  const grid = parseInput();
  const gridIterator = makeGridIterator(grid);
  let count = 0;
  for (const { x, y, value } of gridIterator) {
    // Use set for tops to count only unique tops even if path is the same
    const tops = new Set();
    if (value !== 0) {
      // We only care about starting position where value equals 0
      continue;
    }
    // Breadth first search
    const toVisit = [{ x, y }];
    while (toVisit.length !== 0) {
      const nodePosition = toVisit.shift();
      const nodeValue = getPositionValue(nodePosition, grid);
      if (getPositionValue(nodePosition, grid) === Mountain.Top) {
        tops.add(positionToString(nodePosition));
        continue;
      }
      toVisit.push(
        ...getGridNeighbours(nodePosition, grid).filter(
          (neighbour) => nodeValue + 1 === getPositionValue(neighbour, grid),
        ),
      );
    }
    count += tops.size;
  }
  return count;
}

function solvePart2() {
  const grid = parseInput();
  const gridIterator = makeGridIterator(grid);
  let count = 0;
  for (const { x, y, value } of gridIterator) {
    if (value !== 0) {
      // We only care about starting position where value equals 0
      continue;
    }
    // Breadth first search
    const toVisit = [{ x, y }];
    while (toVisit.length !== 0) {
      const nodePosition = toVisit.shift();
      const nodeValue = getPositionValue(nodePosition, grid);
      if (getPositionValue(nodePosition, grid) === Mountain.Top) {
        // Count only ascends to top
        count += 1;
        continue;
      }
      toVisit.push(
        ...getGridNeighbours(nodePosition, grid).filter(
          (neighbour) => nodeValue + 1 === getPositionValue(neighbour, grid),
        ),
      );
    }
  }
  return count;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
