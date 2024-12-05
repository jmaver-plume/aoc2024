import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  const [rawPageOrderingRules, rawPagesToProduce] = data.split("\n\n");
  const pageOrderingRules = rawPageOrderingRules
    .split("\n")
    .map((line) => line.split("|").map(Number));
  const pagesToProduce = rawPagesToProduce
    .split("\n")
    .map((line) => line.split(",").map(Number));
  return { pageOrderingRules, pagesToProduce };
}

// Returns true if two arrays are equal
function equal(a, b) {
  return a.join(",") === b.join(",");
}

// Creates a compare function used in array sort and sortAt
function createPageCompare(pageOrderingRules) {
  const xToAfterMap = new Map();
  pageOrderingRules.forEach((rule) => {
    const [x, y] = rule;
    if (xToAfterMap.has(x)) {
      xToAfterMap.get(x).add(y);
    } else {
      xToAfterMap.set(x, new Set([y]));
    }
  });

  return function pageCompare(a, b) {
    if (xToAfterMap.get(a)?.has(b)) {
      return -1;
    }
    if (xToAfterMap.get(b)?.has(a)) {
      return 1;
    }
    return 0;
  };
}

function solvePart1() {
  const { pageOrderingRules, pagesToProduce } = parseInput();
  const pageCompare = createPageCompare(pageOrderingRules);
  return pagesToProduce
    .filter((page) => equal(page, page.toSorted(pageCompare)))
    .map((page) => page[Math.floor(page.length / 2)])
    .reduce((sum, val) => sum + val, 0);
}

function solvePart2() {
  const { pageOrderingRules, pagesToProduce } = parseInput();
  const pageCompare = createPageCompare(pageOrderingRules);
  return pagesToProduce
    .filter((page) => !equal(page, page.toSorted(pageCompare)))
    .map((page) => page.toSorted(pageCompare))
    .map((page) => page[Math.floor(page.length / 2)])
    .reduce((sum, val) => sum + val, 0);
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
