const starMap = input.split('\n').reduce((map, line) => {
  map[line.split(')')[1]] = line.split(')')[0];
  return map;
}, {});

const getAncestorCount = body => body in starMap ? 1 + getAncestorCount(starMap[body]) : 0;

console.log(Object.keys(starMap).reduce((sum, body) => sum + getAncestorCount(body), 0));
