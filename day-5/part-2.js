const parameterCount = { 1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 99: 0 };
const codes = input.split(',').map(Number);

let instructionPointer = 0;
function* getInstructions() {
  while (instructionPointer < codes.length) {
    const instruction = codes[instructionPointer];
    const opcode = instruction % 100;
    const modes = Array.from({ length: 3 }, (_, index) => Math.floor(instruction / 10 ** (index + 2) % 10));
    const paramCount = parameterCount[opcode];
    const params = codes.slice(instructionPointer + 1, instructionPointer + paramCount + 1);
    instructionPointer += paramCount + 1;
    yield { opcode, modes, params };
  }
}

function getValue(index, mode) {
  return mode === 0 ? codes[index] : index;
}

function execute({ opcode, modes, params }) {
  switch (opcode) {
    case 1:
      codes[params[2]] = getValue(params[0], modes[0]) + getValue(params[1], modes[1]);
      break;
    case 2:
      codes[params[2]] = getValue(params[0], modes[0]) * getValue(params[1], modes[1]);
      break;
    case 3:
      codes[params[0]] = 5;
      break;
    case 4:
      return getValue(params[0], modes[0]);
    case 5:
      if (getValue(params[0], modes[0])) {
        instructionPointer = getValue(params[1], modes[1]);
      }
      break;
    case 6:
      if (getValue(params[0], modes[0]) === 0) {
        instructionPointer = getValue(params[1], modes[1]);
      }
      break;
    case 7:
      codes[params[2]] = +(getValue(params[0], modes[0]) < getValue(params[1], modes[1]));
      break;
    case 8:
      codes[params[2]] = +(getValue(params[0], modes[0]) === getValue(params[1], modes[1]));
      break;
  }
}

let lastOutput;
for (const instruction of getInstructions()) {
  if (instruction.opcode === 99) {
    break;
  }
  const output = execute(instruction);
  if (typeof output === 'number') {
    lastOutput = output;
  }
}
console.log(lastOutput);
