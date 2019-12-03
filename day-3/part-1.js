const paths = input.split('\n').map(line => line.split(','));
const walkedTiles = new Map();
const intersections = new Set();

const walker = {
  U: (row, column) => [row + 1, column],
  R: (row, column) => [row, column + 1],
  D: (row, column) => [row - 1, column],
  L: (row, column) => [row, column - 1],
}

function walkPath(path, index) {
  let row = 0;
  let column = 0;
  for (const action of path) {
    const direction = action[0];
    const length = Number(action.slice(1));

    for (let i = 0; i < length; i++) {
      [row, column] = walker[direction](row, column);
      // Serializing the coordinates to become keys to keep track of the wires' paths
      const tile = `${row},${column}`;
      if (walkedTiles.has(tile) && walkedTiles.get(tile) !== index) {
        intersections.add(tile);
      }
      // Keeping track of which wire a tile is occupied by, since a wire crossing itself
      // is not a valid intersection
      walkedTiles.set(tile, index);
    }
  }
}
paths.forEach(walkPath);
console.log(Math.min(...[...intersections]
  .map(intersection => intersection.split(',').map(Math.abs))
  .map(([ drow, dcolumn ]) => drow + dcolumn)
));
