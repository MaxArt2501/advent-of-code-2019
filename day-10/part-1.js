const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]; // Enough primes...
const spaceMap = input.trim().split('\n');

const asteroids = new Set();
spaceMap.flatMap((line, row) => {
  line.split('').forEach((char, column) => {
    if (char === '#') {
      asteroids.add(column + ',' + row);
    }
  });
});

function simplifyFraction(numerator, denominator) {
  for (const prime of PRIMES) {
    while (numerator % prime === 0 && denominator % prime === 0) {
      numerator /= prime;
      denominator /= prime;
    }
  }
  return [numerator, denominator];
}

function countVisibile(coords, _, astArray) {
  const [ row, column ] = coords.split(',').map(Number);
  const visible = astArray.filter(astCoords => {
    if (astCoords !== coords) {
      const [ astRow, astColumn ] = astCoords.split(',').map(Number);
      const diffRow = astRow - row;
      const diffColumn = astColumn - column;
      const [ baseColumn, baseRow ] = simplifyFraction(diffColumn, diffRow);
      let checkRow = row + baseRow;
      let checkColum = column + baseColumn;
      while (checkRow !== astRow || checkColum !== astColumn) {
        if (asteroids.has(checkColum + ',' + checkRow)) {
          break;
        }
        checkRow += baseRow;
        checkColum += baseColumn;
      }
      return checkRow === astRow && checkColum === astColumn;
    }
  });
  return visible.length;
}

const asteroidCounts = [ ...asteroids ].map(countVisibile);

console.log(Math.max(...asteroidCounts));
// --> 23,29
