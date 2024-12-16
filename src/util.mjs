export function parseGridInput(input, fn = (v) => v) {
  return input.split("\n").map((line) => line.split(""));
}

export function* makeGridIterator(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      yield { x, y, value: grid[y][x], grid };
    }
  }
}

export function createEmptyGrid(grid, fill = ".") {
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

export function shallowCloneGrid(grid) {
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

export function printGrid(grid) {
  grid.forEach((row) => {
    console.log(row.join(""));
  });
}

/**
 * Returns true if position is inside the grid.
 * @param position
 * @param grid
 * @return {boolean}
 */
export function isInsideGrid(position, grid) {
  return (
    position.x >= 0 &&
    position.x <= grid[0].length - 1 &&
    position.y >= 0 &&
    position.y <= grid.length - 1
  );
}

/**
 * Returns true if position is inside the grid.
 * @param position
 * @param grid
 * @return {boolean}
 */
export function isOnGridEdge(position, grid) {
  return (
    position.x === 0 ||
    position.x === grid[0].length - 1 ||
    position.y === 0 ||
    position.y === grid.length - 1
  );
}

/**
 * Returns all neighbours (including diagonal) for a position in a grid
 *
 * @param {{ x: number, y: number }} position
 * @param {number[][]} grid
 * @param {Object} options
 * @param {boolean} [options.includeDiagonal=false] include diagonal neighbours (e.g., x-1, y-1)
 * @returns {{ x: number, y: number }[]}
 */
export function getGridNeighbours(
  position,
  grid,
  { includeDiagonal } = {
    includeDiagonal: false,
  },
) {
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

  if (includeDiagonal) {
    if (position.x !== 0 && position.y !== 0) {
      neighbours.push({ x: position.x - 1, y: position.y - 1 });
    }
    if (position.x !== maxX && position.y !== 0) {
      neighbours.push({ x: position.x + 1, y: position.y - 1 });
    }
    if (position.x !== maxX && position.y !== maxY) {
      neighbours.push({ x: position.x + 1, y: position.y + 1 });
    }
    if (position.x !== 0 && position.y !== maxY) {
      neighbours.push({ x: position.x - 1, y: position.y + 1 });
    }
  }

  return neighbours;
}

/**
 * Returns stringified representation of a position.
 *
 * @param {{ x: number, y: number }} position
 * @returns {string}
 */
export function positionToString(position) {
  return `${position.x}::${position.y}`;
}

export function stringToPosition(string) {
  const [x, y] = string.split("::");
  return { x: parseInt(x), y: parseInt(y) };
}
