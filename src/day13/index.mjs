import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  const rawClaws = data.split("\n\n");
  return rawClaws.map((rawClaw) => {
    const [rawButtonA, rawButtonB, rawPrize] = rawClaw.split("\n");
    const buttonAMatches = rawButtonA.match(/Button A: X\+(\d+), Y\+(\d+)/);
    const buttonBMatches = rawButtonB.match(/Button B: X\+(\d+), Y\+(\d+)/);
    const prizeMatches = rawPrize.match(/Prize: X=(\d+), Y=(\d+)/);
    return {
      prize: {
        x: parseInt(prizeMatches[1]),
        y: parseInt(prizeMatches[2]),
      },
      a: {
        x: parseInt(buttonAMatches[1]),
        y: parseInt(buttonAMatches[2]),
      },
      b: {
        x: parseInt(buttonBMatches[1]),
        y: parseInt(buttonBMatches[2]),
      },
    };
  });
}

function solvePart1() {
  const claws = parseInput();
  return claws
    .map((claw) => {
      const { prize, a, b } = claw;
      const visited = new Map();

      function solver(position) {
        const positionKey = `${position.x}::${position.y}`;
        if (visited.has(positionKey)) {
          return visited.get(positionKey);
        }
        if (position.x === prize.x && position.y === prize.y) {
          return position;
        }
        if (position.x > prize.x || position.y > prize.y) {
          return { ...position, cost: Infinity };
        }
        const aPosition = {
          x: position.x + a.x,
          y: position.y + a.y,
          cost: position.cost + 3,
        };
        const bPosition = {
          x: position.x + b.x,
          y: position.y + b.y,
          cost: position.cost + 1,
        };
        const aSolution = solver(aPosition);
        const bSolution = solver(bPosition);
        const solution =
          aSolution.cost < bSolution.cost ? aSolution : bSolution;
        visited.set(positionKey, solution);
        return solution;
      }

      const result = solver({ x: 0, y: 0, cost: 0 });
      return result.cost;
    })
    .filter((cost) => cost !== Infinity)
    .reduce((acc, value) => acc + value, 0);
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
