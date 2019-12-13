const parameterCount = { 1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 9: 1, 99: 0 };
const codes = input.split(',').map(Number);
codes[0] = 2; // Play for free!

// This will become out arcade input, instead of a stack
let joystickPosition = 0;
function* createProgramInstance(localCodes) {
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
        localCodes[getAddress(0)] = joystickPosition;
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
      yield output;
    }
  }
}

const game = createProgramInstance(codes, 1);
let score;
let ballX;
let paddleX;
while (true) {
  const { value: x } = game.next();
  if (typeof x === 'undefined') {
    break;
  }
  const { value: y } = game.next();
  const { value } = game.next();
  if (x === -1 && y === 0) {
    score = value;
  } else if (value === 3) {
    paddleX = x;
  } else if (value === 4) {
    ballX = x;
  }
  // This game is Arkanoid, so let's just chase the ball's x coordinate
  joystickPosition = Math.sign(ballX - paddleX);
}
console.log(score);
