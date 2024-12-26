import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  const schematics = data
    .split("\n\n")
    .map((schematic) => schematic.split("\n").map((line) => line.split("")));
  const keys = schematics
    .filter((schematic) => {
      return (
        schematic.at(0).every((item) => item === ".") &&
        schematic.at(-1).every((item) => item === "#")
      );
    })
    .map((key) => {
      const heights = [];
      for (let x = 0; x < key[0].length; x++) {
        let height = 0;
        for (let y = key.length - 1; y >= 0; y--) {
          const value = key[y][x];
          if (value === "#") {
            height += 1;
          } else if (value === ".") {
            break;
          }
        }
        heights.push(height);
      }
      return heights;
    });
  const locks = schematics
    .filter((schematic) => {
      return (
        schematic.at(0).every((item) => item === "#") &&
        schematic.at(-1).every((item) => item === ".")
      );
    })
    .map((lock) => {
      const heights = [];
      for (let x = 0; x < lock[0].length; x++) {
        let height = 0;
        for (let y = 0; y < lock.length; y++) {
          const value = lock[y][x];
          if (value === "#") {
            height += 1;
          } else if (value === ".") {
            break;
          }
        }
        heights.push(height);
      }
      return heights;
    });
  return { keys, locks };
}

function solvePart1() {
  const { keys, locks } = parseInput();
  let count = 0
  keys.forEach(key => {
    locks.forEach(lock => {
      let matches = true
      for (let i = 0; i < key.length; i++) {
        if (key[i] + lock[i] > 7) {
          matches = false;
          break;
        }
      }
      if (matches) {
        count += 1
      }
    })
  })
  return count;
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
