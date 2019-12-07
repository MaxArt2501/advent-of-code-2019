const parameterCount = { 1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 99: 0 };
const codes = input.split(',').map(Number);

function runProgram(localCodes, ...stack) {
  let instructionPointer = 0;
  function* getInstructions() {
    while (instructionPointer < localCodes.length) {
      const instruction = localCodes[instructionPointer];
      const opcode = instruction % 100;
      const modes = Array.from({ length: 3 }, (_, index) => Math.floor(instruction / 10 ** (index + 2) % 10));
      const paramCount = parameterCount[opcode];
      const params = localCodes.slice(instructionPointer + 1, instructionPointer + paramCount + 1);
      instructionPointer += paramCount + 1;
      yield { opcode, modes, params };
    }
  }

  function getValue(index, mode) {
    return mode === 0 ? localCodes[index] : index;
  }

  function execute({ opcode, modes, params }) {
    switch (opcode) {
      case 1:
        localCodes[params[2]] = getValue(params[0], modes[0]) + getValue(params[1], modes[1]);
        break;
      case 2:
        localCodes[params[2]] = getValue(params[0], modes[0]) * getValue(params[1], modes[1]);
        break;
      case 3:
        localCodes[params[0]] = stack.shift();
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
        localCodes[params[2]] = +(getValue(params[0], modes[0]) < getValue(params[1], modes[1]));
        break;
      case 8:
        localCodes[params[2]] = +(getValue(params[0], modes[0]) === getValue(params[1], modes[1]));
        break;
    }
  }

  let lastOutput;
  for (const instruction of getInstructions()) {
    if (instruction.opcode === 99) {
      return lastOutput;
    }
    const output = execute(instruction);
    if (typeof output === 'number') {
      lastOutput = output;
    }
  }
}

// Given a number, returns the corresponding permutation of 0-length.
// Can surely be improved, but it's definitely not the bottleneck.
function getPermutation(length, index) {
  const items = Array.from({ length }, (_, i) => i);
  let factorial = 1;
  return items.reduce((permutation, num) => {
    const itemIdx = Math.floor(index / factorial) % (num + 1);
    factorial *= num + 1;
    permutation.splice(itemIdx, 0, num);
    return permutation;
  }, []);
}
const AMPS = 5;

// Basically, AMPS!
let permutationCount = 1;
for (let i = 1; i <= AMPS; i++) {
  permutationCount *= i;
}

const results = [];
for (let i = 0; i < permutationCount; i++) {
  const permutation = getPermutation(AMPS, i).map(num => num + 5);
  const result = permutation.reduce((previousOutput, phaseSetting) => {
    return runProgram([ ...codes ], phaseSetting, previousOutput);
  }, 0);
  results.push(result);
}
console.log(Math.max(...results));
