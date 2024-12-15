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

function findRobot(grid) {
  for (const { x, y, value } of makeGridIterator(grid)) {
    if (value === "@") {
      return { x, y };
    }
  }
  throw new Error("Robot not found!");
}

function solvePart1() {
  const { grid, moves } = parseInput();
  const robot = findRobot(grid);
  moves.forEach((move) => {
    // find next position
    let nextPosition;
    switch (move) {
      case ">":
        nextPosition = { x: robot.x + 1, y: robot.y };
        break;
      case "<":
        nextPosition = { x: robot.x - 1, y: robot.y };
        break;
      case "v":
        nextPosition = { x: robot.x, y: robot.y + 1 };
        break;
      case "^":
        nextPosition = { x: robot.x, y: robot.y - 1 };
        break;
      default:
        throw new Error(`Unknown move ${move}!`);
    }

    const nextValue = grid[nextPosition.y][nextPosition.x];
    outer: switch (nextValue) {
      case "#":
        break;
      case ".":
        grid[robot.y][robot.x] = ".";
        robot.x = nextPosition.x;
        robot.y = nextPosition.y;
        grid[robot.y][robot.x] = "@";
        break;
      case "O": {
        switch (move) {
          case ">": {
            for (let i = robot.x + 1; i < grid[0].length; i++) {
              if (grid[robot.y][i] === "#") {
                break outer;
              }

              if (grid[robot.y][i] === ".") {
                grid[robot.y][i] = "O";
                grid[robot.y][robot.x] = ".";
                robot.x = nextPosition.x;
                robot.y = nextPosition.y;
                grid[robot.y][robot.x] = "@";
                break outer;
              }
            }
            break;
          }
          case "<": {
            for (let i = robot.x - 1; i > 0; i--) {
              if (grid[robot.y][i] === "#") {
                break outer;
              }

              if (grid[robot.y][i] === ".") {
                grid[robot.y][i] = "O";
                grid[robot.y][robot.x] = ".";
                robot.x = nextPosition.x;
                robot.y = nextPosition.y;
                grid[robot.y][robot.x] = "@";
                break outer;
              }
            }
            break;
          }
          case "v": {
            for (let i = robot.y + 1; i < grid.length; i++) {
              if (grid[i][robot.x] === "#") {
                break outer;
              }

              if (grid[i][robot.x] === ".") {
                grid[i][robot.x] = "O";
                grid[robot.y][robot.x] = ".";
                robot.x = nextPosition.x;
                robot.y = nextPosition.y;
                grid[robot.y][robot.x] = "@";
                break outer;
              }
            }
            break;
          }
          case "^": {
            for (let i = robot.y - 1; i > 0; i--) {
              if (grid[i][robot.x] === "#") {
                break outer;
              }

              if (grid[i][robot.x] === ".") {
                grid[i][robot.x] = "O";
                grid[robot.y][robot.x] = ".";
                robot.x = nextPosition.x;
                robot.y = nextPosition.y;
                grid[robot.y][robot.x] = "@";
                break outer;
              }
            }
            break;
          }
          default:
            throw new Error(`Unknown move ${move}!`);
        }
        break;
      }
      default:
        throw new Error(`Unknown value ${nextValue} in the grid!`);
    }

    print(grid);
  });
  return;
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
