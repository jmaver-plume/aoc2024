import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map((line) => {
    const [sum, rest] = line.split(": ");
    const operands = rest.split(" ").map(Number);
    return { sum: parseInt(sum), operands };
  });
}

function solvePart1() {
  const equations = parseInput();
  return equations
    .filter((equation) => {
      const { sum, operands } = equation;
      let results = [operands[0]];
      operands.slice(1).forEach((operand) => {
        results = results
          .flatMap((result) => [result * operand, result + operand])
          .filter((result) => result <= sum);
      });
      return results.some((result) => result === sum);
    })
    .reduce((sum, equation) => sum + equation.sum, 0);
}

function solvePart2() {
  const equations = parseInput();
  return equations
    .filter((equation) => {
      const { sum, operands } = equation;
      let results = [operands[0]];
      operands.slice(1).forEach((operand) => {
        results = results
          .flatMap((result) => [
            result * operand,
            result + operand,
            Number(`${result}${operand}`),
          ])
          // Performance optimization needed for part 2
          .filter((result) => result <= sum);
      });
      return results.some((result) => result === sum);
    })
    .reduce((sum, equation) => sum + equation.sum, 0);
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
