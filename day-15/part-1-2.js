const parameterCount = { 1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 9: 1, 99: 0 };
const codes = new Uint16Array(input.split(',').map(Number));

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

function moveRobot(column, row, direction) {
  switch (direction) {
    case 1: return [ column, row - 1 ];
    case 2: return [ column, row + 1 ];
    case 3: return [ column - 1, row ];
    case 4: return [ column + 1, row ];
  }
}

function evolveFrontier(initialMap, initialState, condition) {
  const map = { ...initialMap };
  let frontier = { [Object.keys(map)[0]]: initialState };
  let counter = 0;
  while (!(condition(map, frontier))) {
    counter++;
    const newFrontier = {};
    for (const [ coords, state ] of Object.entries(frontier)) {
      const [ column, row ] = coords.split(',').map(Number);
      for (let direction = 1; direction <= 4; direction++) {
        const [ newColumn, newRow ] = moveRobot(column, row, direction);
        const positionKey = `${newColumn},${newRow}`;
        if (positionKey in map) {
          continue;
        }
        const newState = state.slice();
        const drone = createProgramInstance(newState, direction);
        const { value } = drone.next();
        map[positionKey] = value;
        if (value !== 0) {
          newFrontier[positionKey] = newState;
        }
        drone.return(); // Closes the generator to avoid memory leaks
      }
    }
    frontier = newFrontier;
  }
  return [ map, frontier, counter ];
}

const [ tankMap, tankFrontier, movements ] = evolveFrontier({ '0,0': 1 }, codes, map => [ ...Object.values(map) ].includes(2));
console.log('Part 1:', movements);

const leakCoords = Object.keys(tankMap).find(coords => tankMap[coords] === 2);
const leakState = tankFrontier[leakCoords];

const [ ,, fillUpAfter ] = evolveFrontier({ [leakCoords]: 2 }, leakState, (_, frontier) => Object.keys(frontier).length === 0);
// -1 because the last round has always hit a wall
console.log('Part 2:', fillUpAfter - 1);
