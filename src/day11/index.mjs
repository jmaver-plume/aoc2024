import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split(" ").map(Number);
}

/**
 * Changes a stone based on criteria provided
 *
 * @param {number} stone
 * @returns {number[]} - stones
 */
function change(stone) {
  if (stone === 0) {
    return [1];
  }

  const string = stone.toString();
  if (string.length % 2 === 0) {
    return [
      parseInt(string.substring(0, string.length / 2)),
      parseInt(string.substring(string.length / 2)),
    ];
  }

  return [stone * 2024];
}

function solvePart1() {
  let stones = parseInput();
  // Brute force work for part 1
  for (let i = 0; i < 25; i++) {
    stones = stones.flatMap((stone) => change(stone));
  }
  return stones.length;
}

/**
 * Returns memoization key given a stone and a remainder
 *
 * @param {number} stone
 * @param {number} remainder
 * @returns {string}
 */
function getKey(stone, remainder) {
  return `${stone}::${remainder}`;
}

function solve(stone, remainder, cache) {
  if (remainder === 0) {
    return 1;
  }

  const key = getKey(stone, remainder);
  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = change(stone)
    .map((stone) => solve(stone, remainder - 1, cache))
    .reduce((sum, length) => length + sum, 0);
  cache.set(key, result);
  return result;
}

function solvePart2() {
  const stones = parseInput();
  const cache = new Map();
  return stones
    .map((stone) => solve(stone, 75, cache))
    .reduce((sum, length) => sum + length, 0);
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
