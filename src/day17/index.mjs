import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  const [rawRegisters, rawProgram] = data.split("\n\n");
  const registers = rawRegisters.split("\n").reduce((acc, line) => {
    const match = line.match(/Register (\w+): (\d+)/);
    acc[match[1]] = parseInt(match[2]);
    return acc;
  }, {});
  const program = [...rawProgram.matchAll(/\d/g)].map((v) => parseInt(v[0]));
  return { registers, program };
}

function solvePart1() {
  const { registers, program } = parseInput();
  return;
}

function solvePart2() {
  const { registers, program } = parseInput();
  return;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
