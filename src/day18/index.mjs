import fs from "node:fs";
import {createEmptyGrid, printGrid} from "../util.mjs";

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
  bytes.slice(0, 12).forEach(byte => {
    grid[byte.y][byte.x] = '#'
  })
  printGrid(grid)
  return;
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
