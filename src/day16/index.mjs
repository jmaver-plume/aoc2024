import fs from "node:fs";
import { findUniqueInGrid, parseGridInput } from "../util.mjs";

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

function solvePart1() {
  const grid = parseInput();
  const start = findUniqueInGrid((value) => value === Tile.Start, grid);
  const end = findUniqueInGrid((value) => value === Tile.End, grid);
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
