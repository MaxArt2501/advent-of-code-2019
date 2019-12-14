const quantityKey = Symbol();
const reactions = input.trim().split('\n').reduce((map, line) => {
  const [ ingredientList, result ] = line.split(' => ');
  const [ quantity, chemical ] = result.split(' ');
  map[chemical] = ingredientList.split(', ').reduce((ingredientMap, combo) => {
    const [ qty, chem ] = combo.split(' ');
    ingredientMap[chem] = +qty;
    return ingredientMap;
  }, { [quantityKey]: +quantity });
  return map;
}, {});

function getNeededOre(fuel) {
  let neededChemicals = { FUEL: fuel };
  const reserves = {};
  while (Object.keys(neededChemicals).length !== 1 || !('ORE' in neededChemicals)) {
    const newNeededList = {};
    for (const [ chemical, quantity ] of Object.entries(neededChemicals)) {
      if (chemical === 'ORE') {
        newNeededList.ORE = (newNeededList.ORE || 0) + quantity;
        continue;
      }
      const reaction = reactions[chemical];
      const reactionQuantity = reaction[quantityKey];
      const reactionCount = Math.ceil((quantity - (reserves[chemical] || 0)) / reactionQuantity);
      for (const [ ingredient, amount ] of Object.entries(reaction)) {
        newNeededList[ingredient] = (newNeededList[ingredient] || 0) + reactionCount * amount;
      }
      reserves[chemical] = (reserves[chemical] || 0) + reactionCount * reactionQuantity - quantity;
    }
    neededChemicals = newNeededList;
  }
  return neededChemicals.ORE;
}

const orePer1Fuel = getNeededOre(1);

console.log('Part 1:', orePer1Fuel);

const TOTAL_ORE = 1e12;
let estimate;
let newEstimate = Math.floor(TOTAL_ORE / orePer1Fuel);
do {
  estimate = newEstimate;
  const neededEstimate = getNeededOre(estimate);
  newEstimate = Math.floor(estimate * TOTAL_ORE / neededEstimate);
} while (newEstimate > estimate)
console.log('Part 2:', estimate);
