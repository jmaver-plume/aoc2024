import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

const MAX_X = 101;
const MAX_Y = 103;

function print(positions) {
  const grid = [];
  for (let i = 0; i < MAX_Y; i++) {
    const row = [];
    for (let j = 0; j < MAX_X; j++) {
      row.push(".");
    }
    grid.push(row);
  }

  positions.forEach((position) => {
    const value = grid[position.y][position.x];
    if (value === ".") {
      grid[position.y][position.x] = 1;
    } else {
      grid[position.y][position.x] = value + 1;
    }
  });

  grid.forEach((row) => {
    console.log(row.join(""));
  });
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line, i) => {
    const matches = [...line.matchAll(/([+-]?\d+)/g)];
    return {
      id: i,
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
  const midX = (MAX_X - 1) / 2;
  const midY = (MAX_Y - 1) / 2;
  const positions = robots
    .map((robot) => {
      const x = (robot.p.x + 100 * robot.v.x) % MAX_X;
      const y = (robot.p.y + 100 * robot.v.y) % MAX_Y;
      return { x: x < 0 ? MAX_X + x : x, y: y < 0 ? MAX_Y + y : y };
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

function walk(robot) {
  const x = (robot.p.x + robot.v.x) % MAX_X;
  const y = (robot.p.y + robot.v.y) % MAX_Y;
  robot.p.x = x < 0 ? MAX_X + x : x;
  robot.p.y = y < 0 ? MAX_Y + y : y;
}

function solvePart2() {
  // When running with a different output you need to adjust these 2 values as they are input dependent
  const MIDDLE_X = 53;
  const MIDDLE_X_COUNT = 27;

  const grid = [];
  for (let i = 0; i < MAX_Y; i++) {
    const row = [];
    for (let j = 0; j < MAX_X; j++) {
      row.push(".");
    }
    grid.push(row);
  }

  const counts = [];
  const robots = parseInput();
  for (let i = 0; i <= 10403; i++) {
    robots.forEach((robot) => {
      // unset previous
      grid[robot.p.y][robot.p.x] = ".";

      walk(robot);

      // set next/current
      grid[robot.p.y][robot.p.x] = "X";
    });

    let count = 0;
    for (let y = 0; y < MAX_Y; y++) {
      if (grid[y][MIDDLE_X] === "X") {
        count += 1;
      }
    }

    counts.push({ i, count });

    // I first logged sorted counts to find the top counts then I printer the grid
    if (count >= MIDDLE_X_COUNT) {
      console.log(`### Start of ${i} ###`);
      print(robots.map((robot) => robot.p));
      console.log(`### End of ${i} ###`);
      console.log();
    }
  }

  console.log(
    "Counts:",
    counts.sort((a, b) => b.count - a.count),
  );
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
