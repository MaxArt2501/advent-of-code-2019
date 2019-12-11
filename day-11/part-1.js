const parameterCount = { 1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 9: 1, 99: 0 };
const codes = input.split(',').map(Number);

function* createProgramInstance(localCodes, ...stack) {
  let instructionPointer = 0;
  let relativeBase = 0;
  function* getInstructions() {
    while (instructionPointer < localCodes.length) {
      const instruction = Number(localCodes[instructionPointer]);
      const opcode = instruction % 100;
      const modes = Array.from({ length: 3 }, (_, index) => Math.floor(instruction / 10 ** (index + 2) % 10));
      const paramCount = parameterCount[opcode];
      const params = localCodes.slice(instructionPointer + 1, instructionPointer + paramCount + 1);
      instructionPointer += paramCount + 1;
      yield { opcode, modes, params };
    }
  }

  function execute({ opcode, modes, params }) {
    function getAddress(index) {
      return (modes[index] === 2 ? relativeBase : 0) + Number(params[index]);
    }
    function getValue(index) {
      const value = modes[index] === 1 ? params[index] : localCodes[getAddress(index)];
      return typeof value === 'number' ? value : 0;
    }

    switch (opcode) {
      case 1:
        localCodes[getAddress(2)] = getValue(0) + getValue(1);
        break;
      case 2:
        localCodes[getAddress(2)] = getValue(0) * getValue(1);
        break;
      case 3:
        localCodes[getAddress(0)] = stack.shift();
        break;
      case 4:
        return getValue(0);
      case 5:
        if (getValue(0)) {
          instructionPointer = Number(getValue(1));
        }
        break;
      case 6:
        if (getValue(0) === 0) {
          instructionPointer = Number(getValue(1));
        }
        break;
      case 7:
        localCodes[getAddress(2)] = Number(getValue(0) < getValue(1));
        break;
      case 8:
        localCodes[getAddress(2)] = Number(getValue(0) === getValue(1));
        break;
      case 9:
        relativeBase += Number(getValue(0));
        break;
    }
  }

  for (const instruction of getInstructions()) {
    if (instruction.opcode === 99) {
      return;
    }
    const output = execute(instruction);
    if (typeof output === 'number') {
      const newValue = yield output;
      if (typeof newValue !== 'undefined') {
        stack.push(newValue);
      }
    }
  }
}

const paintedPanels = new Map();
const robot = createProgramInstance(codes, 0);
let direction = 0;
let row = 0;
let column = 0;
let currentPaint;
while (true) {
  const { value: paint } = robot.next(currentPaint);
  const coords = column + ',' + row;
  if (paintedPanels.get(coords) === paint) {
    break; // It breaks out after 9515 cycles for me...
  }
  paintedPanels.set(coords, paint);
  const { value: turn } = robot.next();
  direction = (direction + (turn === 0 ? 3 : 1)) % 4;
  switch (direction) {
    case 0: row--; break;
    case 1: column++; break;
    case 2: row++; break;
    case 3: column--; break;
  }
  currentPaint = paintedPanels.get(column + ',' + row) || 0;
}
console.log(paintedPanels.size);
