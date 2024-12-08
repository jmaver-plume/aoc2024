import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line) => line.split(""));
}

// Generic grid methods
// Returns a grid iterator for use in for...of
function* makeGridIterator(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      yield { x, y, value: grid[y][x], grid };
    }
  }
}

// Deep clone a 2D grid
function clone(grid) {
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

function emptyGrid(grid, fill = ".") {
  const empty = [];
  for (let y = 0; y < grid.length; y++) {
    let row = [];
    for (let x = 0; x < grid[0].length; x++) {
      row.push(".");
    }
    empty.push(row);
  }
  return empty;
}

// Returns true if position is inside the grid
function isInside(position, grid) {
  return (
    position.x >= 0 &&
    position.x <= grid[0].length - 1 &&
    position.y >= 0 &&
    position.y <= grid.length - 1
  );
}

function equalsPosition(a, b) {
  return a.x === b.x && a.y === b.y;
}

// Prints a 2D grid
function print(grid) {
  grid.forEach((row) => {
    console.log(row.join(""));
  });
}

function solvePart1() {
  const grid = parseInput();
  const antennaToPositionsMap = new Map();
  const gridIterator = makeGridIterator(grid);
  for (const { x, y, value } of gridIterator) {
    if (value === ".") {
      continue;
    }
    if (antennaToPositionsMap.has(value)) {
      antennaToPositionsMap.get(value).push({ x, y });
    } else {
      antennaToPositionsMap.set(value, [{ x, y }]);
    }
  }

  const antinodes = emptyGrid(grid);
  antennaToPositionsMap.forEach((positions, key) => {
    for (let i = 0; i < positions.length; i++) {
      for (let j = 1; j < positions.length; j++) {
        const xDiff = positions[i].x - positions[j].x;
        const yDiff = positions[i].y - positions[j].y;

        const potentialAntinodes = [
          { x: positions[i].x + xDiff, y: positions[i].y + yDiff },
          { x: positions[i].x - xDiff, y: positions[i].y - yDiff },
          { x: positions[j].x + xDiff, y: positions[j].y + yDiff },
          { x: positions[j].x - xDiff, y: positions[j].y - yDiff },
        ];
        potentialAntinodes
          .filter(
            (antinode) =>
              !equalsPosition(positions[i], antinode) &&
              !equalsPosition(positions[j], antinode) &&
              isInside(antinode, grid),
          )
          .forEach((antinode) => {
            antinodes[antinode.y][antinode.x] = "#";
          });
      }
    }
  });
  return antinodes.flatMap((v) => v).filter((v) => v === "#").length;
}

function solvePart2() {
  const grid = parseInput();
  const antennaToPositionsMap = new Map();
  const gridIterator = makeGridIterator(grid);
  for (const { x, y, value } of gridIterator) {
    if (value === ".") {
      continue;
    }
    if (antennaToPositionsMap.has(value)) {
      antennaToPositionsMap.get(value).push({ x, y });
    } else {
      antennaToPositionsMap.set(value, [{ x, y }]);
    }
  }

  const antinodes = emptyGrid(grid);
  antennaToPositionsMap.forEach((positions, key) => {
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const xDiff = positions[i].x - positions[j].x;
        const yDiff = positions[i].y - positions[j].y;

        const potentialAntinodes = [];
        let count = 1;
        while (
          Math.abs(count * xDiff) < grid[0].length &&
          Math.abs(count * yDiff) < grid.length
        ) {
          potentialAntinodes.push({
            x: positions[i].x + count * xDiff,
            y: positions[i].y + count * yDiff,
          });
          potentialAntinodes.push({
            x: positions[i].x - count * xDiff,
            y: positions[i].y - count * yDiff,
          });
          potentialAntinodes.push({
            x: positions[j].x + count * xDiff,
            y: positions[j].y + count * yDiff,
          });
          potentialAntinodes.push({
            x: positions[j].x - count * xDiff,
            y: positions[j].y - count * yDiff,
          });
          count += 1;
        }

        potentialAntinodes
          .filter((antinode) => isInside(antinode, grid))
          .forEach((antinode) => {
            antinodes[antinode.y][antinode.x] = "#";
          });
      }
    }
  });
  return antinodes.flatMap((v) => v).filter((v) => v === "#").length;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
