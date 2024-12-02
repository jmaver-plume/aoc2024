import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line) => line.split(" ").map(Number));
}

function isSafe(line) {
  const isIncreasing = line[1] > line[0];
  for (let i = 1; i < line.length; i++) {
    const distance = Math.abs(line[i] - line[i - 1]);
    if (
      line[i] > line[i - 1] !== isIncreasing ||
      distance === 0 ||
      distance > 3
    ) {
      return false;
    }
  }
  return true;
}

function without(arr, index) {
  return arr.filter((_, arrIndex) => index !== arrIndex);
}

function solvePart1() {
  const input = parseInput();
  return input.filter((line) => isSafe(line)).length;
}

function solvePart2() {
  const input = parseInput();
  return input.filter((line) => {
    // Each line can have either 0 or 1 element removed, try all combinations
    const combinations = [
      line,
      ...Array.from({ length: line.length }).map((_, i) => without(line, i)),
    ];
    return combinations.some(isSafe);
  }).length;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
