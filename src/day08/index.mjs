import fs from "node:fs";
import {
  createEmptyGrid,
  isInsideGrid,
  makeGridIterator,
  parseGridInput,
} from "../util.mjs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return parseGridInput(data);
}

function equalsPosition(a, b) {
  return a.x === b.x && a.y === b.y;
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

  const antinodes = createEmptyGrid(grid);
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
              isInsideGrid(antinode, grid),
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

  const antinodes = createEmptyGrid(grid);
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
          .filter((antinode) => isInsideGrid(antinode, grid))
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
