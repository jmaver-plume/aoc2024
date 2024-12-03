import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  return readInput();
}

function solvePart1() {
  const input = parseInput();
  const matches = [...input.matchAll(/mul\((\d+),(\d+)\)/g)];
  const instructions = matches.map((match) => [
    parseInt(match[1]),
    parseInt(match[2]),
  ]);
  return instructions.reduce((sum, [first, second]) => sum + first * second, 0);
}

function solvePart2() {
  const input = parseInput();
  const matches = [...input.matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g)];
  const enabledMatches = [];
  let isEnabledInstruction = true;
  matches.forEach((match) => {
    if (match[0].includes("don't()")) {
      isEnabledInstruction = false;
    } else if (match[0].includes("do()")) {
      isEnabledInstruction = true;
    } else {
      if (isEnabledInstruction) {
        enabledMatches.push(match);
      }
    }
  });
  const instructions = enabledMatches.map((match) => [
    parseInt(match[1]),
    parseInt(match[2]),
  ]);
  return instructions.reduce((sum, [first, second]) => sum + first * second, 0);
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
