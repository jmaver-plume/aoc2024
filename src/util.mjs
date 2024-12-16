export function parseGridInput(input, fn = (v) => v) {
  return input.split("\n").map((line) => line.split(""));
}
