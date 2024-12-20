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

function range(n) {
  const r = [];
  for (let i = 1; i <= n; i++) {
    r.push(i);
  }
  return r;
}

function solvePart2() {
  const { colors, towels } = parseInput();
  const validTowels = getValidTowels(towels, colors);
  const colorsSet = new Set(colors);
  const maxColorSize = Math.max(...colors.map((c) => c.length));

  const cache = {};
  validTowels.forEach((towel) => {
    const partials = range(towel.length).map((i) => towel.substring(0, i));
    const options = partials.map((partial) =>
      range(Math.min(partial.length, maxColorSize)).map((i) => ({
        left: partial.substring(0, partial.length - i),
        right: partial.substring(partial.length - i),
      })),
    );
    options.forEach((options) => {
      cache[options[0].left + options[0].right] = options.reduce(
        (count, { left, right }) => {
          if (colorsSet.has(right) && left === "") {
            return count + 1;
          }
          if (colorsSet.has(right) && cache[left]) {
            return count + cache[left];
          }
          return count;
        },
        0,
      );
    });
  });

  return validTowels.reduce((sum, towel) => sum + cache[towel], 0);
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
