const starMap = input.split('\n').reduce((map, line) => {
  map[line.split(')')[1]] = line.split(')')[0];
  return map;
}, {});

const getAncestors = body => body in starMap ? [ ...getAncestors(starMap[body]), starMap[body] ] : [];

const youAncestors = getAncestors('YOU');
const santaAncestors = getAncestors('SAN');

const transfers = youAncestors
  .filter(body => santaAncestors.includes(body))
  .map(body => [
    ...youAncestors.slice(youAncestors.indexOf(body)).reverse(),
    ...santaAncestors.slice(santaAncestors.indexOf(body) + 1)
  ]);

console.log(Math.min(...transfers.map(xfer => xfer.length - 1)));
