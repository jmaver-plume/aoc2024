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

/**
 * Returns stringified representation of a position.
 *
 * @param {{ x: number, y: number }} position
 * @returns {string}
 */
function positionToString(position) {
  return `${position.x}::${position.y}`;
}

function stringToPosition(string) {
  const [x, y] = string.split("::");
  return { x: parseInt(x), y: parseInt(y) };
}

/**
 * Returns the value on grid at position.
 *
 * @param {{ x: number, y: number }} position
 * @param {string[][]} grid
 * @returns {string}
 */
function getPositionValue(position, grid) {
  return grid[position.y][position.x];
}

/**
 * Returns all neighbours (including diagonal) for a position in a grid
 *
 * @param {{ x: number, y: number }} position
 * @param {string[][]} grid
 * @returns {{ x: number, y: number }[]}
 */
function getNeighbours(position, grid) {
  const maxX = grid[0].length - 1;
  const maxY = grid.length - 1;
  const neighbours = [];
  if (position.x !== 0) {
    neighbours.push({ x: position.x - 1, y: position.y });
  }
  if (position.x !== maxX) {
    neighbours.push({ x: position.x + 1, y: position.y });
  }
  if (position.y !== 0) {
    neighbours.push({ x: position.x, y: position.y - 1 });
  }
  if (position.y !== maxY) {
    neighbours.push({ x: position.x, y: position.y + 1 });
  }
  return neighbours;
}

function isOnEdge(position, grid) {
  return (
    position.x === 0 ||
    position.x === grid[0].length - 1 ||
    position.y === 0 ||
    position.y === grid.length - 1
  );
}

function solvePart1() {
  const grid = parseInput();
  const maxX = grid[0].length - 1;
  const maxY = grid.length - 1;
  let result = 0;
  const visitedPositions = new Set();
  for (const { x, y, value } of makeGridIterator(grid)) {
    const position = { x, y };
    const positionString = positionToString(position);
    if (visitedPositions.has(positionString)) {
      continue;
    }

    // Calculate region
    const visitedRegionPositions = new Set();
    const queue = [position];
    while (queue.length) {
      const first = queue.shift();
      const firstKey = positionToString(first);
      if (visitedRegionPositions.has(firstKey)) {
        continue;
      }
      visitedRegionPositions.add(firstKey);
      const neighbours = getNeighbours(first, grid).filter(
        (position) => getPositionValue(position, grid) === value,
      );
      queue.push(...neighbours);
    }

    let regionPerimeter = 0;
    [...visitedRegionPositions]
      .map((string) => stringToPosition(string))
      .forEach((position) => {
        // Boundary perimeters
        if (position.x === 0) {
          regionPerimeter += 1;
        }
        if (position.y === 0) {
          regionPerimeter += 1;
        }
        if (position.x === maxX) {
          regionPerimeter += 1;
        }
        if (position.y === maxY) {
          regionPerimeter += 1;
        }

        // Add neighbour parameters
        regionPerimeter += getNeighbours(position, grid).filter(
          (position) => getPositionValue(position, grid) !== value,
        ).length;

        visitedPositions.add(positionToString(position));
      });

    result += visitedRegionPositions.size * regionPerimeter;
  }
  return result;
}

function compact(list) {
  if (list.length === 0) {
    return [];
  }
  const result = [list[0]];
  for (let i = 1; i < list.length; i++) {
    if (result.at(-1) + 1 === list[i]) {
      result[result.length - 1] = list[i];
    } else {
      result.push(list[i]);
    }
  }
  return result;
}

function solvePart2() {
  const grid = parseInput();

  // Calculate all regions
  const regions = [];
  const visitedPositions = new Set();
  for (const { x, y, value } of makeGridIterator(grid)) {
    const position = { x, y };
    const positionString = positionToString(position);
    if (visitedPositions.has(positionString)) {
      continue;
    }

    // Calculate region
    const visitedRegionPositions = new Set();
    const queue = [position];
    while (queue.length) {
      const first = queue.shift();
      const firstKey = positionToString(first);
      if (visitedRegionPositions.has(firstKey)) {
        continue;
      }
      visitedRegionPositions.add(firstKey);
      visitedPositions.add(firstKey);
      const neighbours = getNeighbours(first, grid).filter(
        (position) => getPositionValue(position, grid) === value,
      );
      queue.push(...neighbours);
    }

    // Add region to all regions
    regions.push(visitedRegionPositions);
  }

  let finalResult = 0;
  regions.forEach((region) => {
    const positions = [...region].map((region) => stringToPosition(region));
    const value = grid[positions[0].y][positions[0].x];
    // Calculate row edges
    const upperEdges = new Map();
    const lowerEdges = new Map();
    const rightEdges = new Map();
    const leftEdges = new Map();

    // Calculate upper and lower edges by walking from top to bottom and counting adding all edges that for a position
    // e.g. on row 1 the region has 3 nodes on columns 1, 3, and 4 that have an upper edge (neighbour is not same value)
    //      since 3 and 4 are neighbours we compact them into 1, 4 -> on row 1 we have 2 upper edges
    //      we repeat this process for every position for upper, lower, left, right edges
    // For upper, lower edges we sort from top to bottom then left to right.
    // For left, right edges we sort from left to right then top to bottom.
    positions
      .toSorted((a, b) => {
        if (a.y < b.y) {
          return -1;
        } else if (a.y > b.y) {
          return 1;
        } else {
          return a.x < b.x ? -1 : 1;
        }
      })
      .forEach((position) => {
        if (position.y === 0 || grid[position.y - 1][position.x] !== value) {
          // if it is on edge or upper neighbour is not equal add edge to set
          if (upperEdges.has(position.y)) {
            upperEdges.get(position.y).push(position.x);
          } else {
            upperEdges.set(position.y, [position.x]);
          }
        }

        if (
          position.y === grid.length - 1 ||
          grid[position.y + 1][position.x] !== value
        ) {
          // if it is on edge or down neighbour is not equal add edge to set
          if (lowerEdges.has(position.y)) {
            lowerEdges.get(position.y).push(position.x);
          } else {
            lowerEdges.set(position.y, [position.x]);
          }
        }
      });

    // Calculate left and right edges
    positions
      .toSorted((a, b) => {
        if (a.x < b.x) {
          return -1;
        } else if (a.x > b.x) {
          return 1;
        } else {
          return a.y < b.y ? -1 : 1;
        }
      })
      .forEach((position) => {
        if (position.x === 0 || grid[position.y][position.x - 1] !== value) {
          // if it is on edge or left neighbour is not equal add edge to set
          if (leftEdges.has(position.x)) {
            leftEdges.get(position.x).push(position.y);
          } else {
            leftEdges.set(position.x, [position.y]);
          }
        }

        if (
          position.x === grid[0].length - 1 ||
          grid[position.y][position.x + 1] !== value
        ) {
          // if it is on edge or right neighbour is not equal add edge to set
          if (rightEdges.has(position.x)) {
            rightEdges.get(position.x).push(position.y);
          } else {
            rightEdges.set(position.x, [position.y]);
          }
        }
      });

    const rightCount = [...rightEdges.values()]
      .map((list) => compact(list).length)
      .reduce((sum, value) => value + sum, 0);

    const leftCount = [...leftEdges.values()]
      .map((list) => compact(list).length)
      .reduce((sum, value) => value + sum, 0);

    const upperCount = [...upperEdges.values()]
      .map((list) => compact(list).length)
      .reduce((sum, value) => value + sum, 0);

    const lowerCount = [...lowerEdges.values()]
      .map((list) => compact(list).length)
      .reduce((sum, value) => value + sum, 0);

    const count = rightCount + leftCount + upperCount + lowerCount;
    finalResult += count * positions.length;
  });

  return finalResult;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
