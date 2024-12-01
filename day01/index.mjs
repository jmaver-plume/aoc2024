import fs from "node:fs";

// Parse input into 2 separate lists of numbers
function parseInput() {
  const input = process.env.INPUT ?? "sample.txt";
  const rawData = fs.readFileSync(new URL(input, import.meta.url), "utf-8");
  const { leftList, rightList } = rawData.split("\n").reduce(
    ({ leftList, rightList }, line) => {
      const match = line.match(/(\d+)\s+(\d+)/);
      return {
        leftList: leftList.concat(parseInt(match[1])),
        rightList: rightList.concat(parseInt(match[2])),
      };
    },
    { leftList: [], rightList: [] },
  );
  return { leftList, rightList };
}

function solvePart1() {
  const { leftList, rightList } = parseInput();
  leftList.sort((a, b) => a - b);
  rightList.sort((a, b) => a - b);
  let distance = 0;
  for (let i = 0; i < leftList.length; i++) {
    distance += Math.abs(leftList[i] - rightList[i]);
  }
  return distance;
}

function solvePart2() {
  const { leftList, rightList } = parseInput();
  const frequencyMap = new Map();
  rightList.forEach((number) => {
    const count = frequencyMap.get(number) ?? 0;
    frequencyMap.set(number, count + 1);
  });
  return leftList.reduce(
    (similarity, number) =>
      similarity + number * (frequencyMap.get(number) ?? 0),
    0,
  );
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
