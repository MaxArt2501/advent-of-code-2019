const coordRE = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
function* getStates() {
  // Every satellite state is a vector of six numbers
  let satellites = input.trim().split('\n').map(line => ([
    ...line.match(coordRE).slice(1).map(Number),
    0, 0, 0
  ]));
  while (true) {
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
    yield satellites;
  }
}

function getTaxiDriverLength(vector) {
  return vector.reduce((sum, length) => sum + Math.abs(length), 0);
}

function getTotalEnergy(satellites) {
  return satellites.reduce((total, satellite) => {
    return total + getTaxiDriverLength(satellite.slice(0, 3)) * getTaxiDriverLength(satellite.slice(3));
  }, 0)
}

const states = getStates();
let satellites;
for (let i = 0; i < 1000; i++) {
  ({ value: satellites } = states.next());
}
console.log(getTotalEnergy(satellites));
