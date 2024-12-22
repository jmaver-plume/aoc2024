import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  return data.split("\n").map(BigInt);
}

function solvePart1() {
  const secrets = parseInput();
  for (let i = 0; i < 2000; i++) {
    secrets.forEach((secret, i) => {
      const one = ((secret * BigInt(64)) ^ secret) % BigInt(16777216);
      const two = ((one / BigInt(32)) ^ one) % BigInt(16777216);
      const three = ((two * BigInt(2048)) ^ two) % BigInt(16777216);
      secrets[i] = three;
    });
  }
  return secrets.reduce((sum, value) => sum + value, BigInt(0));
}

function solvePart2() {
  const secrets = parseInput();
  const history = {};
  secrets.forEach((secret) => {
    history[secret] = [
      { value: secret, ones: secret % BigInt(10), change: null },
    ];
  });
  secrets.forEach((secret, i) => {
    let current = secret;
    for (let i = 0; i < 1999; i++) {
      const one = ((current * BigInt(64)) ^ current) % BigInt(16777216);
      const two = ((one / BigInt(32)) ^ one) % BigInt(16777216);
      const three = ((two * BigInt(2048)) ^ two) % BigInt(16777216);
      current = three;
      const currentOnes = current % BigInt(10);
      history[secret].push({
        value: current,
        ones: currentOnes,
        change: currentOnes - history[secret].at(-1).ones,
      });
    }
    secrets[i] = current;
  });

  const sequences = {};
  Object.values(history).forEach((history) => {
    const usedSequences = new Set();
    for (let i = 4; i < history.length; i++) {
      const a = history[i - 3].change;
      const b = history[i - 2].change;
      const c = history[i - 1].change;
      const d = history[i].change;
      if (a === b || b === c || c === d) {
        // require 4 consecutive changes
        continue;
      }
      const sequence = [a, b, c, d].join(",");
      if (usedSequences.has(sequence)) {
        // monkey will stop at first sequence
        continue;
      } else {
        usedSequences.add(sequence);
      }
      const value = history[i].ones;
      sequences[sequence] = sequences[sequence]
        ? sequences[sequence] + value
        : value;
    }
  });

  let bestSequence = null;
  let bestValue = null;
  Object.entries(sequences).forEach((entry) => {
    const [sequence, value] = entry;
    if (bestValue === null || value > bestValue) {
      bestValue = value;
      bestSequence = sequence;
    }
  });
  return bestValue;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
