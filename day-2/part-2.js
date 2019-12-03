const originalProgram = input.split(',').map(Number);
const target = 19690720;

function runProgram(code) {
  // This is inefficient and would perform much better with a pre-generater Uint32Array
  // Turns out it's fast enough after all...
  const program = [ ...originalProgram ];
  program[1] = Math.floor(code / 100);
  program[2] = code % 100;

  let instructionPointer = 0;
  let opcode;
  while ((opcode = program[instructionPointer]) !== 99) {
    const val1 = program[program[instructionPointer + 1]];
    const val2 = program[program[instructionPointer + 2]];
    program[program[instructionPointer + 3]] = opcode === 1 ? val1 + val2 : val1 * val2;
    instructionPointer += 4;
  }

  return program[0];
}

// The best solution would imply reverse engineering the program.
// But that would be far too complex for the second day... 😅
for (let i = 0; i < 9999; i++) {
  const result = runProgram(i);
  if (result === target) {
    console.log(i);
    break;
  }
}
