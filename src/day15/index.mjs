import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  const [rawGrid, rawMoves] = data.split("\n\n");
  const grid = rawGrid.split("\n").map((line) => line.split(""));
  const moves = rawMoves
    .split("\n")
    .map((line) => line.split(""))
    .flat();
  return { grid, moves };
}

function* makeGridIterator(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      yield { x, y, value: grid[y][x], grid };
    }
  }
}

function findRobot(grid) {
  for (const { x, y, value } of makeGridIterator(grid)) {
    if (value === "@") {
      return { x, y };
    }
  }
}

function solvePart1() {
  const { grid, moves } = parseInput();
  const robot = findRobot(grid)
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
