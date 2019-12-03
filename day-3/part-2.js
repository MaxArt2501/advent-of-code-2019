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
  let distance = 0;

  for (const action of path) {
    const direction = action[0];
    const length = Number(action.slice(1));

    for (let i = 0; i < length; i++) {
      [row, column] = walker[direction](row, column);
      distance++;
      // Serializing the coordinates to become keys to keep track of the wires' paths
      const tile = `${row},${column}`;
      if (walkedTiles.has(tile) && walkedTiles.get(tile)[0] !== index) {
        // Intersections now contain just the sum of the distances
        intersections.add(distance + walkedTiles.get(tile)[1]);
      }
      // Now we must keep track of the distance we've walked so far, as it's needed to
      // be added to the other wire's distance in case of an intersection
      walkedTiles.set(tile, [index, distance]);
    }
  }
}
paths.forEach(walkPath);
console.log(Math.min(...intersections));
