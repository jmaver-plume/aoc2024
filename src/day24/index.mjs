import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  const [rawValues, rawConnections] = data.split("\n\n");
  const values = rawValues
    .split("\n")
    .map((line) => {
      return { key: line.split(": ")[0], value: parseInt(line.split(": ")[1]) };
    })
    .reduce((acc, value) => {
      acc[value.key] = value.value;
      return acc;
    }, {});
  const connections = rawConnections.split("\n").map((line) => {
    const match = line.match(
      /([a-zA-Z0-9]+) (AND|XOR|OR) ([a-zA-Z0-9]+) -> ([a-zA-Z0-9]+)/,
    );
    return {
      left: match[1],
      operator: match[2],
      right: match[3],
      result: match[4],
    };
  });
  return { values, connections };
}

function getResult(values, connections) {
  while (connections.length) {
    const remainingConnections = [];
    connections.forEach((connection) => {
      if (!(connection.left in values) || !(connection.right in values)) {
        remainingConnections.push(connection);
        return;
      }
      if (connection.operator === "AND") {
        values[connection.result] =
          values[connection.left] & values[connection.right];
      } else if (connection.operator === "OR") {
        values[connection.result] =
          values[connection.left] | values[connection.right];
      } else if (connection.operator === "XOR") {
        values[connection.result] =
          values[connection.left] ^ values[connection.right];
      }
    });
    connections = remainingConnections;
  }

  return parseInt(
    Object.entries(values)
      .filter((entry) => entry[0].startsWith("z"))
      .sort((a, b) => a[0].localeCompare(b[0]))
      .reverse()
      .map((entry) => entry[1])
      .join(""),
    2,
  );
}

function solvePart1() {
  const input = parseInput();
  return getResult(input.values, input.connections)
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
