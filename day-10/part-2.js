const spaceMap = input.trim().split('\n');
const stationRow = 29;
const stationColumn = 23;

const asteroids = new Set();
spaceMap.flatMap((line, row) => {
  line.split('').forEach((char, column) => {
    if (char === '#') {
      asteroids.add([ column, row ]);
    }
  });
});

const polarCoords = new Map();
asteroids.forEach(([ column, row ]) => {
  if (column === stationColumn && row === stationRow) {
    return;
  }
  const diffColumn = stationColumn - column;
  const diffRow = stationRow - row;
  const theta = (Math.atan2(diffColumn, -diffRow) + Math.PI) % (Math.PI * 2);
  const rho = Math.sqrt(diffColumn ** 2 + diffRow ** 2);
  if (polarCoords.has(theta)) {
    polarCoords.get(theta).add(rho);
  } else {
    polarCoords.set(theta, new Set([ rho ]));
  }
});

function* getTargets() {
  const sortedAngles = new Set([ ...polarCoords.keys() ].sort((a, b) => a - b));
  while (sortedAngles.size) {
    for (const theta of sortedAngles) {
      const rhos = polarCoords.get(theta);
      if (rhos.size === 1) {
        sortedAngles.delete(theta);
        yield [theta, ...rhos];
      } else {
        const nearest = Math.min(...rhos);
        rhos.delete(nearest);
        yield [theta, nearest];
      }
    }
  }
}

function toOrtho(theta, rho) {
  return [
    stationColumn + Math.round(Math.sin(theta) * rho),
    stationRow - Math.round(Math.cos(theta) * rho)
  ]
}

const targets = getTargets();
let value;
for (let i = 0; i < 200; i++) {
  ({ value } = targets.next());
}
const [ resColumn, resRow ] = toOrtho(...value);
console.log(resColumn * 100 + resRow);
