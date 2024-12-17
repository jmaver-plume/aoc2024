import fs from "node:fs";
import {
  Direction,
  findUniqueInGrid,
  getNextPosition,
  makeGridIterator,
  parseGridInput,
  positionToString,
  printGrid,
  PriorityQueue,
  shallowCloneGrid,
} from "../util.mjs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return parseGridInput(data);
}

const Tile = {
  Start: "S",
  End: "E",
  Wall: "#",
  Empty: ".",
};

function rotateLeft(direction) {
  switch (direction) {
    case Direction.Up:
      return Direction.Left;
    case Direction.Left:
      return Direction.Down;
    case Direction.Down:
      return Direction.Right;
    case Direction.Right:
      return Direction.Up;
    default:
      throw new Error(`Invalid direction ${direction}.`);
  }
}

function rotateRight(direction) {
  switch (direction) {
    case Direction.Up:
      return Direction.Right;
    case Direction.Right:
      return Direction.Down;
    case Direction.Down:
      return Direction.Left;
    case Direction.Left:
      return Direction.Up;
    default:
      throw new Error(`Invalid direction ${direction}.`);
  }
}

function solver(position, direction, cost, visited, cache, grid) {
  // We returned to original path
  if (visited.has(key)) {
    return { cost: Infinity, visited: new Set(visited) };
  }

  const nextPosition = getNextPosition(position, direction);
  if (grid[nextPosition.y][nextPosition.x] === Tile.End) {
    const clonedVisited = new Set(visited);
    clonedVisited.add(key);
    return { cost: cost + 1, visited: clonedVisited };
  }

  const rotateLeftVisited = new Set(visited);
  rotateLeftVisited.add(key);
  possibilities.push(
    solver(
      position,
      rotateLeft(direction),
      cost + 1000,
      rotateLeftVisited,
      cache,
      grid,
    ),
  );

  const rotateRightVisited = new Set(visited);
  rotateRightVisited.add(key);
  possibilities.push(
    solver(
      position,
      rotateRight(direction),
      cost + 1000,
      rotateRightVisited,
      cache,
      grid,
    ),
  );

  possibilities.sort((a, b) => a.cost - b.cost);
  cache.set(key, possibilities[0]);
  return cache.get(key);
}

function print(visited, grid) {
  const clonedGrid = shallowCloneGrid(grid);
  [...visited]
    .map((value) => {
      const [x, y, direction] = value.split("::");
      return {
        position: {
          x: parseInt(x),
          y: parseInt(y),
        },
        direction,
      };
    })
    .forEach(({ position, direction }) => {
      clonedGrid[position.y][position.x] = direction;
    });
  printGrid(clonedGrid);
}

function toString(position, direction) {
  return `${position.x}::${position.y}::${direction}`;
}

function fromString(string) {
  const [x, y, direction] = string.split("::");
  return { position: { x: parseInt(x), y: parseInt(y) }, direction };
}

function solvePart1() {
  const grid = parseInput();

  const pq = new PriorityQueue();
  const dist = {};
  const prev = {};

  // Assign distance to every node
  for (const { x, y, value } of makeGridIterator(grid)) {
    if (value === Tile.Wall) {
      continue;
    }

    if (value === Tile.Start) {
      dist[toString({ x, y }, Direction.Right)] = 0;
      pq.add(toString({ x, y }, Direction.Right), 0);
    } else {
      dist[toString({ x, y }, Direction.Right)] = Infinity;
      pq.add(toString({ x, y }, Direction.Right), Infinity);
    }

    dist[toString({ x, y }, Direction.Left)] = Infinity;
    pq.add(toString({ x, y }, Direction.Left), Infinity);

    dist[toString({ x, y }, Direction.Up)] = Infinity;
    pq.add(toString({ x, y }, Direction.Up), Infinity);

    dist[toString({ x, y }, Direction.Down)] = Infinity;
    pq.add(toString({ x, y }, Direction.Down), Infinity);
  }

  while (!pq.isEmpty()) {
    const u = pq.extractMin();
    const { position, direction } = fromString(u);
    const neighbours = [];

    // forward neighbour
    const forwardPosition = getNextPosition(position, direction);
    if (grid[forwardPosition.y][forwardPosition.x] !== Tile.Wall) {
      neighbours.push({ position: forwardPosition, direction, distance: 1 });
    }

    // rotate left neighbour
    neighbours.push({
      position,
      direction: rotateLeft(direction),
      distance: 1000,
    });

    // rotate right neighbour
    neighbours.push({
      position,
      direction: rotateRight(direction),
      distance: 1000,
    });

    neighbours.forEach((neighbour) => {
      const alt = dist[u] + neighbour.distance;
      const v = toString(neighbour.position, neighbour.direction);
      if (alt < dist[v]) {
        prev[v] = u;
        dist[v] = alt;
        pq.decreasePriority(v, alt);
      }
    });
  }

  const end = findUniqueInGrid((value) => value === Tile.End, grid);

  let result = Infinity;
  Object.entries(dist).forEach(entry => {
    const [key, value] = entry
    const { position, direction } = fromString(key)
    if (position.x === end.x && position.y === end.y && value < result ) {
      result = value
    }
  })

  return result;
}

function solvePart2() {
  const input = parseInput();
  return;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
