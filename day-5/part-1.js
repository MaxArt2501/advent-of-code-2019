const parameterCount = { 1: 3, 2: 3, 3: 1, 4: 1, 99: 0 };
const codes = input.split(',').map(Number);

function* getInstructions() {
  let instructionPointer = 0;
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
      codes[params[0]] = 1;
      break;
    case 4:
      return getValue(params[0], modes[0]);
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
