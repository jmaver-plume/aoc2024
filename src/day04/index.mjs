import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((l) => l.split(""));
}

// Returns all neighbours (including diagonal) for a point in a matrix
function getNeighbours(point, matrix) {
  const maxX = matrix[0].length - 1;
  const maxY = matrix.length - 1;

  const result = [];
  if (point.x !== 0) {
    result.push({ x: point.x - 1, y: point.y });
  }
  if (point.x !== maxX) {
    result.push({ x: point.x + 1, y: point.y });
  }
  if (point.y !== 0) {
    result.push({ x: point.x, y: point.y - 1 });
  }
  if (point.y !== maxY) {
    result.push({ x: point.x, y: point.y + 1 });
  }
  if (point.x !== 0 && point.y !== 0) {
    result.push({ x: point.x - 1, y: point.y - 1 });
  }
  if (point.x !== maxX && point.y !== 0) {
    result.push({ x: point.x + 1, y: point.y - 1 });
  }
  if (point.x !== maxX && point.y !== maxY) {
    result.push({ x: point.x + 1, y: point.y + 1 });
  }
  if (point.x !== 0 && point.y !== maxY) {
    result.push({ x: point.x - 1, y: point.y + 1 });
  }
  return result;
}

function find(path, paths, matrix) {
  const lastPoint = path.at(-1);
  const lastValue = matrix[lastPoint.y][lastPoint.x];
  if (lastValue === "S") {
    paths.push(path);
    return;
  }

  const nextValue =
    lastValue === "X"
      ? "M"
      : lastValue === "M"
        ? "A"
        : lastValue === "A"
          ? "S"
          : null;
  const neighbours = getNeighbours(lastPoint, matrix).filter((neighbour) => {
    if (matrix[neighbour.y][neighbour.x] !== nextValue) {
      return false;
    }
    if (path.length === 1) {
      // If path is 1 there is currently no direction so neighbour is valid
      return true;
    }
    // If path is larger than 1 we need to ensure direction is maintained
    const diffX = path[0].x - path[1].x;
    const diffY = path[0].y - path[1].y;
    const neighbourDiffX = path.at(-1).x - neighbour.x;
    const neighbourDiffY = path.at(-1).y - neighbour.y;
    return diffX === neighbourDiffX && diffY === neighbourDiffY;
  });

  neighbours.forEach((neighbour) =>
    find(path.concat(neighbour), paths, matrix),
  );
}

function solvePart1() {
  const matrix = parseInput();
  const paths = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] !== "X") {
        continue;
      }
      find([{ x, y }], paths, matrix);
    }
  }
  return paths.length;
}

function solvePart2() {
  const matrix = parseInput();
  let count = 0;
  // Start at 1 and end at -2 because we know valid A is not on the edge
  for (let y = 1; y < matrix.length - 1; y++) {
    for (let x = 1; x < matrix[y].length - 1; x++) {
      if (matrix[y][x] !== "A") {
        continue;
      }
      const firstDiagonal = new Set([
        matrix[y + 1][x - 1],
        matrix[y - 1][x + 1],
      ]);
      const secondDiagonal = new Set([
        matrix[y - 1][x - 1],
        matrix[y + 1][x + 1],
      ]);
      if (
        firstDiagonal.has("M") &&
        firstDiagonal.has("S") &&
        secondDiagonal.has("M") &&
        secondDiagonal.has("S")
      ) {
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
