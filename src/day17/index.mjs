import fs from "node:fs";

function readInput() {
  const input = process.env.INPUT ?? "sample.txt";
  return fs.readFileSync(new URL(input, import.meta.url), "utf-8");
}

function parseInput() {
  const data = readInput();
  const [rawRegisters, rawInstructions] = data.split("\n\n");
  const registers = rawRegisters.split("\n").reduce((acc, line) => {
    const match = line.match(/Register (\w+): (\d+)/);
    acc[match[1]] = parseInt(match[2]);
    return acc;
  }, {});
  const instructions = [...rawInstructions.matchAll(/\d/g)].map((v) =>
    parseInt(v[0]),
  );
  return new Program(registers, instructions);
}

class Program {
  #instructionPointer;
  #registers;
  #originalRegisters;
  #instructions;
  #output;
  #path;

  constructor(registers, instructions) {
    this.#originalRegisters = registers;
    this.#instructionPointer = 0;
    this.#registers = registers;
    this.#instructions = instructions;
    this.#output = [];
    this.#path = [];
  }

  setRegisters(registers) {
    this.#registers = registers;
  }

  reset() {
    this.#registers = this.#originalRegisters;
    this.#instructionPointer = 0;
    this.#output = [];
    this.#path = [];
  }

  getPath() {
    return this.#path;
  }

  getInstructions() {
    return this.#instructions;
  }

  getOutput() {
    return this.#output;
  }

  run() {
    while (this.#instructionPointer < this.#instructions.length) {
      const opcode = this.#getOpcode();
      this.#path.push(opcode);
      switch (opcode) {
        case 0:
          this.#adv();
          break;
        case 1:
          this.#bxl();
          break;
        case 2:
          this.#bst();
          break;
        case 3:
          this.#jnz();
          break;
        case 4:
          this.#bxc();
          break;
        case 5:
          this.#out();
          break;
        case 6:
          this.#bdv();
          break;
        case 7:
          this.#cdv();
          break;
        default:
          throw new Error("Unknown opcode.");
      }
    }
  }

  #adv() {
    const operand = this.#getComboOperand();
    const denominator = Math.pow(2, operand);
    this.#registers.A = Math.trunc(this.#registers.A / denominator);
    this.#incrementPointer();
  }

  #bxl() {
    const operand = this.#getLiteralOperand();
    this.#registers.B = this.#registers.B ^ operand;
    this.#incrementPointer();
  }

  #bst() {
    const operand = this.#getComboOperand();
    this.#registers.B = operand % 8;
    this.#incrementPointer();
  }

  #jnz() {
    if (this.#registers.A === 0) {
      this.#incrementPointer();
      return;
    }
    this.#instructionPointer = this.#getLiteralOperand();
  }

  #bxc() {
    this.#registers.B = this.#registers.B ^ this.#registers.C;
    this.#incrementPointer();
  }

  #out() {
    const operand = this.#getComboOperand();
    this.#output.push(operand % 8);
    this.#incrementPointer();
  }

  #bdv() {
    const operand = this.#getComboOperand();
    const denominator = Math.pow(2, operand);
    this.#registers.B = Math.trunc(this.#registers.A / denominator);
    this.#incrementPointer();
  }

  #cdv() {
    const operand = this.#getComboOperand();
    const denominator = Math.pow(2, operand);
    this.#registers.C = Math.trunc(this.#registers.A / denominator);
    this.#incrementPointer();
  }

  #incrementPointer() {
    this.#instructionPointer += 2;
  }

  #getOpcode() {
    return this.#instructions[this.#instructionPointer];
  }

  #getLiteralOperand() {
    return this.#instructions[this.#instructionPointer + 1];
  }

  #getComboOperand() {
    const operand = this.#getLiteralOperand();
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return operand;
      case 4:
        return this.#registers.A;
      case 5:
        return this.#registers.B;
      case 6:
        return this.#registers.C;
      default:
        throw new Error(`Invalid combo operand ${operand}.`);
    }
  }
}

function solvePart1() {
  const program = parseInput();
  const instructions = program.getInstructions();


  for (let i = 0; i <= 10000000; i++) {
    program.reset();
    program.setRegisters({ A: i, B: 0, C: 0 });
    program.run();
    const output = program.getOutput();
    if (
      output.at(0) === instructions.at(0) &&
      output.at(1) === instructions.at(1) &&
      output.at(2) === instructions.at(2) &&
      output.at(3) === instructions.at(3) &&
      output.at(4) === instructions.at(4) &&
      output.at(5) === instructions.at(5) &&
      output.at(6) === instructions.at(6)
    ) {
      console.log(i, i.toString(8), output);
    }
  }
}

function solvePart2() {
  const program = parseInput();
  return;
}

// Run code
const part1Result = solvePart1();
console.log(`Part 1: ${part1Result}`);
const part2Result = solvePart2();
console.log(`Part 2: ${part2Result}`);

// 2, 1, 7, 1, 0, 4
