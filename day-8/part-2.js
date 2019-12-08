const WIDTH = 25;
const HEIGHT = 6;
const layerSize = WIDTH * HEIGHT;

const layers = input.match(new RegExp(`[012]{${layerSize}}`, 'g'));

const composed = Array.from({ length: layerSize }, (_, index) => {
  return layers.find(layer => layer[index] !== '2')[index];
});

console.log(
  composed.join('')
    .replace(/0/g, ' ').replace(/1/g, '#')
    .match(new RegExp(`[012]{${WIDTH}}`, 'g'))
    .join('\n')
);
