import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line) => {
    const matches = [...line.matchAll(/([+-]?\d+)/g)];
    return {
      p: {
        x: parseInt(matches[0][0]),
        y: parseInt(matches[1][0]),
      },
      v: {
        x: parseInt(matches[2][0]),
        y: parseInt(matches[3][0]),
      },
    };
  });
}

function solvePart1() {
  const robots = parseInput();
  return;
}

function solvePart2() {
  const robots = parseInput();
  return;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
