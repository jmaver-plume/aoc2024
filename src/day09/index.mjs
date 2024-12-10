import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

/**
 * @returns {{ id: number | null, length: number }[]}
 */
function parseInput() {
  const data = readInput();
  const numbers = data.split("").map(Number);

  const result = [];
  let isFile = true;
  let id = 0;
  numbers.forEach((number) => {
    const entry = {
      id: isFile ? id : null,
      length: number,
    };
    result.push(entry);

    if (isFile) id += 1;
    isFile = !isFile;
  });
  return result;
}

/**
 * @param {{ id: number | null, length: number }[]} disk
 * @returns {void}
 */
function print(disk) {
  const str = flatten(disk).reduce(
    (acc, value) => (value === null ? `${acc}.` : `${acc}${value}`),
    "",
  );
  console.log(str);
}

/**
 * @param {{ id: number | null, length: number }[]} disk
 * @returns {(number|null)[]}
 */
function flatten(disk) {
  return disk.flatMap((value) => {
    const result = [];
    for (let i = 0; i < value.length; i++) {
      result.push(value.id);
    }
    return result;
  });
}

/**
 * @param {{ id: number | null, length: number }[]} disk
 * @returns {number}
 */
function checksum(disk) {
  return flatten(disk).reduce((acc, value, index) => acc + value * index);
}

function solvePart1() {
  const disk = parseInput();
  let firstSpaceIndex = disk.findIndex((value) => value.id === null);
  while (firstSpaceIndex !== -1) {
    const last = disk.pop();
    if (last.id === null) {
      continue;
    }
    const firstSpace = disk[firstSpaceIndex];
    if (firstSpace.length === last.length) {
      disk[firstSpaceIndex] = last;
    } else if (firstSpace.length > last.length) {
      disk[firstSpaceIndex] = last;
      disk.splice(firstSpaceIndex + 1, 0, {
        id: null,
        length: firstSpace.length - last.length,
      });
    } else {
      disk[firstSpaceIndex] = { id: last.id, length: firstSpace.length };
      disk.push({ id: last.id, length: last.length - firstSpace.length });
    }

    firstSpaceIndex = disk.findIndex((value) => value.id === null);
  }
  return checksum(disk);
}

function solvePart2() {
  const disk = parseInput();

  let fileIndex = disk.length - 1;
  while (fileIndex !== 0) {
    const file = disk[fileIndex];
    if (file.id === null) {
      // It's actually space
      fileIndex--;
      continue;
    }

    const spaceIndex = disk.findIndex(
      (space, spaceIndex) =>
        space.id === null &&
        space.length >= file.length &&
        spaceIndex < fileIndex,
    );
    if (spaceIndex === -1) {
      // No empty space found
      fileIndex--;
      continue;
    }

    const space = disk[spaceIndex];
    if (space.length === file.length) {
      // swap space and file
      [disk[spaceIndex], disk[fileIndex]] = [disk[fileIndex], disk[spaceIndex]];
      fileIndex--;
    } else {
      disk[spaceIndex] = { ...file };
      disk[fileIndex] = { id: null, length: file.length };
      // Insert smaller space after file
      disk.splice(spaceIndex + 1, 0, {
        id: null,
        length: space.length - file.length,
      });
    }
  }

  return checksum(disk);
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);
