const WIDTH = 25;
const HEIGHT = 6;
const layerSize = WIDTH * HEIGHT;

const layers = input.match(new RegExp(`[012]{${layerSize}}`, 'g'));

function count(string, needle) {
  return string.split(needle).length - 1;
}
const digitCounts = [0, 1, 2].map(digit => layers.map(layer => count(layer, digit)));
const minZeros = Math.min(...digitCounts[0]);
const minZeroLayerIndex = digitCounts[0].indexOf(minZeros);

console.log(digitCounts[1][minZeroLayerIndex] * digitCounts[2][minZeroLayerIndex]);
