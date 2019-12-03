const program = input.split(',').map(Number);
program[1] = 12;
program[2] = 2;

let instructionPointer = 0;
let opcode;
while ((opcode = program[instructionPointer]) !== 99) {
  const val1 = program[program[instructionPointer + 1]];
  const val2 = program[program[instructionPointer + 2]];
  program[program[instructionPointer + 3]] = opcode === 1 ? val1 + val2 : val1 * val2;
  instructionPointer += 4;
}

console.log(program[0]);
