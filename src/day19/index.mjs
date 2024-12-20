import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "solution.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  const sections = data.split("\n\n");
  const colors = sections[0].split(", ");
  const towels = sections[1].split("\n");
  return { colors, towels };
}

function getValidTowels(towels, colors) {
  const regex = new RegExp(`^(${colors.join("|")})+$`);
  return towels.filter((towel) => towel.match(regex));
}

function solvePart1() {
  const { colors, towels } = parseInput();
  return getValidTowels(towels, colors).length;
}

function solvePart2() {
  const { colors, towels } = parseInput();
  const validTowels = getValidTowels(towels, colors);
  return validTowels.length;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
