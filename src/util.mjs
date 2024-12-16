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
