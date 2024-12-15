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

const Tile = {
  Robot: "@",
  SmallBox: "O",
  Empty: ".",
  Wall: "#",
  LargeBoxLeft: "[",
  LargeBoxRight: "]",
};

function findRobotStartingPosition(grid) {
  for (const { x, y, value } of makeGridIterator(grid)) {
    if (value === Tile.Robot) {
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

function moveRobot(robot, direction, grid) {
  const nextPosition = getNextPosition(robot, direction);
  grid[robot.y][robot.x] = Tile.Empty;
  robot.x = nextPosition.x;
  robot.y = nextPosition.y;
  grid[robot.y][robot.x] = Tile.Robot;
}

function getGPSCoordinateSum(grid) {
  let result = 0;
  for (const { x, y, value } of makeGridIterator(grid)) {
    if (value === Tile.SmallBox || value === Tile.LargeBoxLeft) {
      result += 100 * y + x;
    }
  }
  return result;
}

function solve(grid, moves) {
  const robot = findRobotStartingPosition(grid);
  moves.forEach((direction) => {
    const nextPosition = getNextPosition(robot, direction);
    const nextValue = grid[nextPosition.y][nextPosition.x];
    if (nextValue === Tile.Wall) {
      return;
    }

    if (nextValue === Tile.Empty) {
      moveRobot(robot, direction, grid);
      return;
    }

    // Find all boxes that should be moved
    const boxesToMove = new Set();
    const queue = [nextPosition];
    while (queue.length) {
      const position = queue.shift();
      const key = `${position.x}::${position.y}`;
      if (boxesToMove.has(key)) {
        continue;
      }
      const value = grid[position.y][position.x];
      if (value === Tile.Wall) {
        return;
      }
      if (value === Tile.SmallBox) {
        queue.push(
          { x: position.x, y: position.y },
          getNextPosition({ x: position.x, y: position.y }, direction),
        );
        boxesToMove.add(key);
      }
      if (value === Tile.LargeBoxLeft) {
        queue.push(
          { x: position.x, y: position.y },
          { x: position.x + 1, y: position.y },
          getNextPosition({ x: position.x, y: position.y }, direction),
          getNextPosition({ x: position.x + 1, y: position.y }, direction),
        );
        boxesToMove.add(key);
      }
      if (value === Tile.LargeBoxRight) {
        queue.push(
          { x: position.x - 1, y: position.y },
          { x: position.x, y: position.y },
          getNextPosition({ x: position.x - 1, y: position.y }, direction),
          getNextPosition({ x: position.x, y: position.y }, direction),
        );
        boxesToMove.add(key);
      }
    }

    const boxes = [...boxesToMove].map((s) => {
      const [x, y] = s.split("::");
      return { x: parseInt(x), y: parseInt(y), value: grid[y][x] };
    });

    // The same boxes moved to the new position
    const newBoxes = boxes.map((box) => ({
      ...box,
      ...{ ...box, ...getNextPosition(box, direction) },
    }));

    if (!newBoxes.every((box) => grid[box.y][box.x] !== "#")) {
      // If any of the new positions is a wall the move cannot complete
      return;
    }

    // Unset old box locations
    boxes.forEach((box) => {
      grid[box.y][box.x] = ".";
    });

    // Set new box locations
    newBoxes.forEach((box) => {
      grid[box.y][box.x] = box.value;
    });

    // Move robot
    moveRobot(robot, direction, grid);
  });
  print(grid);
  return getGPSCoordinateSum(grid);
}

function solvePart1() {
  // Parse input
  const { grid, moves } = parseInput();

  // Solve
  return solve(grid, moves);
}

function solvePart2() {
  // Parse input
  const { grid, moves } = parseInput();

  // Increase grid size
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

  // Solve
  return solve(largeGrid, moves);
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
