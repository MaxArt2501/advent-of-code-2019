const parameterCount = { 1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 99: 0 };
const codes = input.split(',').map(Number);

// As amplifiers are now stateful machines, we'll sort out to generators again.
// A copy of the memory and the input stack is given.
function* createProgramInstance(localCodes, ...stack) {
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
        const result = getValue(params[0], modes[0]) * getValue(params[1], modes[1]);
        localCodes[params[2]] = result;
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

  for (const instruction of getInstructions()) {
    if (instruction.opcode === 99) {
      return;
    }
    const output = execute(instruction);
    if (typeof output === 'number') {
      // In order to resume execution, we get a new input (passed with .next())
      stack.push(yield output);
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

function createAmplifier(phaseSetting, initialInput) {
  const ampCodes = [ ...codes ];
  return createProgramInstance(ampCodes, phaseSetting, initialInput);
}

const AMPS = 5;

// Basically, AMPS!
let permutationCount = 1;
for (let i = 1; i <= AMPS; i++) {
  permutationCount *= i;
}

function runPermutation(permutation) {
  let previousOutput = 0;
  const amplifiers = [];
  let counter = 0;
  while (true) {
    const index = counter % AMPS;
    if (amplifiers.length - 1 < index) {
      amplifiers.push(createAmplifier(permutation[index], previousOutput));
    }
    const amplifier = amplifiers[index];
    const { value } = amplifier.next(previousOutput);
    if (typeof value === 'number') {
      previousOutput = value;
    } else {
      return previousOutput;
    }
    counter++;
  }
}

const results = [];
for (let i = 0; i < permutationCount; i++) {
  const permutation = getPermutation(AMPS, i).map(num => num + 5);
  const result = runPermutation(permutation);
  results.push(result);
}
console.log(Math.max(...results));
