const coordRE = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
function* getStates() {
  // Every satellite state is a vector of six numbers
  let satellites = input.trim().split('\n').map(line => ([
    ...line.match(coordRE).slice(1).map(Number),
    0, 0, 0
  ]));
  while (true) {
    yield satellites;
    satellites = satellites.map(satellite => {
      const velocity = satellite.slice(3);
      const nextVelocity = velocity.map((value, index) => {
        return satellites.reduce((diff, sat) => {
          return diff + Math.sign(sat[index] - satellite[index])
        }, value);
      });
      const nextPosition = satellite.slice(0, 3).map((value, index) => value + nextVelocity[index]);
      return [
        ...nextPosition,
        ...nextVelocity
      ];
    });
  }
}

function getPeriod(distances) {
  for (let length = 1; length <= distances.length; length++) {
    const sums = [];
    const limit = distances.length - distances.length % length;
    for (let i = 0; i < limit; i += length) {
      let sum = 0;
      for (let j = 0; j < length; j++) {
        sum += distances[i + j];
      }
      sums.push(sum);
    }
    // If every sum is the same, then that sum is *probably* the period
    if (sums.length > 0 && sums.every(sum => sum === sums[0])) {
      return sums[0];
    }
  }
}

const states = getStates();
let { value: satellites } = states.next();
const initialStates = satellites.flatMap(satellite => [ ...satellite ]);
const marks = initialStates.map(() => new Set());

for (let i = 1; i < 1e6; i++) {
  ({ value: satellites } = states.next());
  satellites.forEach((satellite, index) => {
    for (let j = 0; j < 6; j++) {
      if (satellite[j] === initialStates[index * 6 + j]) {
        marks[index * 6 + j].add(i);
      }
    }
  });
}

const markDistances = marks.map(
  set => Array.from(set).map((mark, i) => mark - (i ? marks[i - 1] : 0))
);
console.log([ ...new Set(markDistances.map(getPeriod)) ].join(' '));
// ... no, that won't give you the result right away. You need to compute
// the least common multiple of those numbers. You can do that online, for
// example here: https://www.calculatorsoup.com/calculators/math/lcm.php
