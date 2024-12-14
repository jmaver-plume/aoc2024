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
  const maxX = 101;
  // const maxX = 11;
  const maxY = 103;
  // const maxY = 7;
  const midX = (maxX - 1) / 2;
  const midY = (maxY - 1) / 2;
  const positions = robots
    .map((robot) => {
      const x = (robot.p.x + 100 * robot.v.x) % maxX;
      const y = (robot.p.y + 100 * robot.v.y) % maxY;
      return { x: x < 0 ? maxX + x : x, y: y < 0 ? maxY + y : y };
    })
    .filter((position) => position.x !== midX && position.y !== midY);

  return Object.values(
    Object.groupBy(positions, ({ x, y }) => {
      if (x < midX && y < midY) {
        return 1;
      }
      if (x > midX && y < midY) {
        return 2;
      }
      if (x < midX && y > midY) {
        return 3;
      }
      if (x > midX && y > midY) {
        return 4;
      }

      throw new Error(`Invalid position!`);
    }),
  )
    .map((v) => v.length)
    .reduce((acc, val) => acc * val, 1);
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
