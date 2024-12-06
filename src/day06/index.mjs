import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line) => line.split(""));
}

function getStart(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "^") {
        return { x, y, direction: "^", visited: new Set() };
      }
    }
  }
}

function isOut(guard, grid) {
  return (
    guard.x < 0 ||
    guard.x > grid[0].length - 1 ||
    guard.y < 0 ||
    guard.y > grid.length - 1
  );
}

function rotate(guard) {
  if (guard.direction === "^") {
    return { ...guard, direction: ">" };
  } else if (guard.direction === ">") {
    return { ...guard, direction: "v" };
  } else if (guard.direction === "v") {
    return { ...guard, direction: "<" };
  } else {
    return { ...guard, direction: "^" };
  }
}

function move(guard, grid) {
  let nextPosition;
  if (guard.direction === "^") {
    nextPosition = { x: guard.x, y: guard.y - 1 };
  } else if (guard.direction === "v") {
    nextPosition = { x: guard.x, y: guard.y + 1 };
  } else if (guard.direction === "<") {
    nextPosition = { x: guard.x - 1, y: guard.y };
  } else {
    nextPosition = { x: guard.x + 1, y: guard.y };
  }

  if (isOut(nextPosition, grid)) {
    grid[guard.y][guard.x] = "X";
    return nextPosition;
  }

  if (grid[nextPosition.y][nextPosition.x] !== "#") {
    const state = `${guard.x}::${guard.y}::${guard.direction}`;
    if (guard.visited.has(state)) {
      return null;
    } else {
      grid[guard.y][guard.x] = "X";
      return {
        ...nextPosition,
        direction: guard.direction,
        visited: guard.visited.add(
          `${guard.x}::${guard.y}::${guard.direction}`,
        ),
      };
    }
  } else {
    return rotate(guard);
  }
}

function count(grid) {
  let count = 0;
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell === "X") {
        count++;
      }
    });
  });
  return count;
}

function print(grid) {
  grid.forEach((row) => {
    console.log(row.join(""));
  });
}

function solvePart1() {
  const grid = parseInput();
  let guard = getStart(grid);
  while (!isOut(guard, grid)) {
    guard = move(guard, grid);
  }
  return count(grid) + 1;
}

function getClone(grid) {
  const clone = [];
  for (let y = 0; y < grid.length; y++) {
    let row = [];
    for (let x = 0; x < grid[0].length; x++) {
      row.push(grid[y][x]);
    }
    clone.push(row);
  }
  return clone;
}

function solvePart2() {
  const grid = parseInput();

  const firstClone = getClone(grid);
  let firstGuard = getStart(firstClone);
  while (!isOut(firstGuard, firstClone)) {
    firstGuard = move(firstGuard, firstClone);
  }

  let count = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] !== "." || firstClone[y][x] === ".") {
        continue;
      }

      const clone = getClone(grid);
      clone[y][x] = "#";
      let guard = getStart(clone);
      let isLoop = false;
      while (!isOut(guard, clone)) {
        guard = move(guard, clone);
        if (guard === null) {
          isLoop = true;
          break;
        }
      }

      if (isLoop) {
        count += 1;
      }
    }
  }
  return count;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
