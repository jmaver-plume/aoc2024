import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  const [rawGrid, rawMoves] = data.split("\n\n");
  const grid = rawGrid.split("\n").map((line) => line.split(""));
  const moves = rawMoves
    .split("\n")
    .map((line) => line.split(""))
    .flat();
  return { grid, moves };
}

function* makeGridIterator(grid) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      yield { x, y, value: grid[y][x], grid };
    }
  }
}

// Prints a 2D grid
function print(grid) {
  grid.forEach((row) => {
    console.log(row.join(""));
  });
  console.log();
}

const Direction = {
  Right: ">",
  Left: "<",
  Down: "v",
  Up: "^",
};

function findRobot(grid) {
  for (const { x, y, value } of makeGridIterator(grid)) {
    if (value === "@") {
      return { x, y };
    }
  }
  throw new Error("Robot not found!");
}

/**
 * Returns true if the robot can push in the given direction
 * @param position - of the box
 * @param direction
 * @param grid
 * @returns {boolean}
 */
function canPush(position, direction, grid) {
  if (direction === Direction.Right) {
    for (let i = position.x + 1; i < grid[0].length; i++) {
      if (grid[position.y][i] === "#") {
        return false;
      }
      if (grid[position.y][i] === ".") {
        return true;
      }
    }
  }

  if (direction === Direction.Left) {
    for (let i = position.x - 1; i >= 0; i--) {
      if (grid[position.y][i] === "#") {
        return false;
      }
      if (grid[position.y][i] === ".") {
        return true;
      }
    }
  }

  if (direction === Direction.Down) {
    for (let i = position.y + 1; i < grid.length; i++) {
      if (grid[i][position.x] === "#") {
        return false;
      }
      if (grid[i][position.x] === ".") {
        return true;
      }
    }
  }

  if (direction === Direction.Up) {
    for (let i = position.y - 1; i >= 0; i--) {
      if (grid[i][position.x] === "#") {
        return false;
      }
      if (grid[i][position.x] === ".") {
        return true;
      }
    }
    return false;
  }

  throw new Error(`Invalid direction ${direction}!`);
}

function push(position, direction, grid) {
  if (direction === Direction.Right) {
    let end;
    for (let i = position.x + 1; i < grid[0].length; i++) {
      if (grid[position.y][i] === ".") {
        end = i;
        break;
      }
    }

    for (let i = end; i > position.x; i--) {
      grid[position.y][i] = grid[position.y][i - 1];
    }
    grid[position.y][position.x] = ".";
  }

  if (direction === Direction.Left) {
    let end;
    for (let i = position.x - 1; i > 0; i--) {
      if (grid[position.y][i] === ".") {
        end = i;
        break;
      }
    }

    for (let i = end; i < position.x; i++) {
      grid[position.y][i] = grid[position.y][i + 1];
    }
    grid[position.y][position.x] = ".";
  }

  if (direction === Direction.Down) {
    let end;
    for (let i = position.y + 1; i < grid.length; i++) {
      if (grid[i][position.x] === ".") {
        end = i;
        break;
      }
    }

    for (let i = end; i > position.y; i--) {
      grid[i][position.x] = grid[i - 1][position.x];
    }
    grid[position.y][position.x] = ".";
  }

  if (direction === Direction.Up) {
    let end;
    for (let i = position.y - 1; i > 0; i--) {
      if (grid[i][position.x] === ".") {
        end = i;
        break;
      }
    }

    for (let i = end; i < position.y; i++) {
      grid[i][position.x] = grid[i + 1][position.x];
    }
    grid[position.y][position.x] = ".";
  }
}

function getNextPosition(position, direction) {
  switch (direction) {
    case ">":
      return { x: position.x + 1, y: position.y };
    case "<":
      return { x: position.x - 1, y: position.y };
    case "v":
      return { x: position.x, y: position.y + 1 };
    case "^":
      return { x: position.x, y: position.y - 1 };
    default:
      throw new Error(`Unknown direction ${direction}!`);
  }
}

function moveRobot(robot, direction, grid) {
  const nextPosition = getNextPosition(robot, direction);
  grid[robot.y][robot.x] = ".";
  robot.x = nextPosition.x;
  robot.y = nextPosition.y;
  grid[robot.y][robot.x] = "@";
}

function move(robot, direction, grid) {
  const nextPosition = getNextPosition(robot, direction);
  const nextValue = grid[nextPosition.y][nextPosition.x];
  if (nextValue === "#") {
  } else if (nextValue === ".") {
    moveRobot(robot, direction, grid);
  } else if (nextValue === "O") {
    if (canPush(nextPosition, direction, grid)) {
      push(nextPosition, direction, grid);
      moveRobot(robot, direction, grid);
    }
  }
}

function solvePart1() {
  const { grid, moves } = parseInput();
  const robot = findRobot(grid);
  moves.forEach((direction) => {
    move(robot, direction, grid);
  });

  let result = 0;
  for (const { x, y, value } of makeGridIterator(grid)) {
    if (value !== "O") {
      continue;
    }
    result += 100 * y + x;
  }
  return result;
}

function isLargeBox(value) {
  return value === "[" || value === "]";
}

function getChange(direction) {
  switch (direction) {
    case Direction.Left:
      return { x: -1, y: 0 };
    case Direction.Right:
      return { x: +1, y: 0 };
    case Direction.Down:
      return { x: 0, y: +1 };
    case Direction.Up:
      return { x: 0, y: -1 };
  }
}

function changePosition(position, change) {
  return {
    x: position.x + change.x,
    y: position.y + change.y,
  };
}

function solvePart2() {
  const { grid, moves } = parseInput();

  // increase grid size
  const largeGrid = [];
  for (let y = 0; y < grid.length; y++) {
    const row = [];
    for (let x = 0; x < grid[0].length; x++) {
      const value = grid[y][x];
      if (value === "#" || value === ".") {
        row.push(value, value);
      } else if (value === "@") {
        row.push(value, ".");
      } else if (value === "O") {
        row.push("[", "]");
      } else {
        throw new Error(`Invalid grid element ${value}!`);
      }
    }
    largeGrid.push(row);
  }

  const robot = findRobot(largeGrid);
  moves.forEach((direction) => {
    const nextPosition = getNextPosition(robot, direction);
    const nextValue = largeGrid[nextPosition.y][nextPosition.x];
    if (nextValue === "#") {
    } else if (nextValue === ".") {
      moveRobot(robot, direction, largeGrid);
    } else if (isLargeBox(nextValue)) {
      const toMove = [nextPosition];
      const visited = new Set();
      while (toMove.length) {
        const position = toMove.shift();
        const key = `${position.x}::${position.y}`;
        if (visited.has(key)) {
          continue;
        }
        const value = largeGrid[position.y][position.x];
        if (value === "#") {
          return;
        } else if (isLargeBox(value)) {
          if (value === "[") {
            toMove.push(
              { x: position.x, y: position.y },
              { x: position.x + 1, y: position.y },
              getNextPosition({ x: position.x, y: position.y }, direction),
              getNextPosition({ x: position.x + 1, y: position.y }, direction),
            );
          } else {
            toMove.push(
              { x: position.x - 1, y: position.y },
              { x: position.x, y: position.y },
              getNextPosition({ x: position.x - 1, y: position.y }, direction),
              getNextPosition({ x: position.x, y: position.y }, direction),
            );
          }
          visited.add(key);
        }
      }

      const change = getChange(direction);
      const currentBoxes = [...visited].map((s) => {
        const [x, y] = s.split("::");
        return { x: parseInt(x), y: parseInt(y), value: largeGrid[y][x] };
      });

      const newBoxes = currentBoxes.map((box) => ({
        ...box,
        ...changePosition(box, change),
      }));

      if (!newBoxes.every((box) => largeGrid[box.y][box.x] !== "#")) {
        return;
      }

      currentBoxes.forEach((box) => {
        largeGrid[box.y][box.x] = ".";
      });

      newBoxes.forEach((box) => {
        largeGrid[box.y][box.x] = box.value;
      });

      moveRobot(robot, direction, largeGrid);
    }
  });

  print(largeGrid);

  let result = 0;
  for (const { x, y, value } of makeGridIterator(largeGrid)) {
    if (value !== "[") {
      continue;
    }
    const yDist = Math.min(y,);
    const xDist = Math.min(x, );
    result += 100 * yDist + xDist;
  }
  return result;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
