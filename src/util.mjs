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

export function findUniqueInGrid(predicate, grid) {
  for (const { x, y, value } of makeGridIterator(grid)) {
    if (predicate(value)) {
      return { x, y };
    }
  }
  throw new Error("Value not found in grid.");
}

export const Direction = {
  Right: ">",
  Left: "<",
  Down: "v",
  Up: "^",
};

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

export function getNextPosition(position, direction) {
  switch (direction) {
    case Direction.Right:
      return { x: position.x + 1, y: position.y };
    case Direction.Left:
      return { x: position.x - 1, y: position.y };
    case Direction.Down:
      return { x: position.x, y: position.y + 1 };
    case Direction.Up:
      return { x: position.x, y: position.y - 1 };
    default:
      throw new Error(`Unknown direction ${direction}!`);
  }
}

class MinHeap {
  constructor(mapper = (v) => v) {
    this.items = [];
    this.mapper = mapper;
  }

  pop() {
    if (this.items.length === 0) {
      return null;
    }

    if (this.items.length === 1) {
      return this.items.pop();
    }

    // Swap last with first value
    [this.items[0], this.items[this.items.length - 1]] = [
      this.items[this.items.length - 1],
      this.items[0],
    ];

    const result = this.items.pop();

    // Fix the broken array
    let index = 0;
    let leftChildIndex = this.#leftChild(index);
    let rightChildIndex = this.#rightChild(index);
    let smallerIndex =
      this.items[leftChildIndex] < this.items[rightChildIndex]
        ? leftChildIndex
        : rightChildIndex;
    while (this.items[index] > this.items[smallerIndex]) {
      [this.items[index], this.items[smallerIndex]] = [
        this.items[smallerIndex],
        this.items[index],
      ];

      index = 0;
      leftChildIndex = this.#leftChild(index);
      rightChildIndex = this.#rightChild(index);
      smallerIndex =
        this.items[leftChildIndex] < this.items[rightChildIndex]
          ? leftChildIndex
          : rightChildIndex;
    }

    return result;
  }

  push(value) {
    this.items.push(value);

    let index = this.items.length - 1;
    let parentIndex = this.#parent(index);
    while (this.items[index] < this.items[parentIndex]) {
      // Swap values
      [this.items[index], this.items[parentIndex]] = [
        this.items[parentIndex],
        this.items[index],
      ];

      index = parentIndex;
      parentIndex = Math.ceil(index / 2) - 1;
    }
  }

  #parent(i) {
    return Math.floor((i - 1) / 2);
  }

  #leftChild(i) {
    return 2 * i + 1;
  }

  #rightChild(i) {
    return 2 * i + 2;
  }
}
