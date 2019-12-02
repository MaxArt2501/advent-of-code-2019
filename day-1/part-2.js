function getFuel(mass) {
  return Math.max(Math.floor(mass / 3) - 2, 0);
}
function getTotalFuel(mass) {
  const moduleFuel = getFuel(mass);
  let fuelFuel = 0;
  let additionalFuel = moduleFuel;
  while (additionalFuel > 0) {
    additionalFuel = getFuel(additionalFuel);
    fuelFuel += additionalFuel;
  }
  return moduleFuel + fuelFuel;
}

console.log(input.trim().split('\n').map(getTotalFuel).reduce((sum, fuel) => sum + fuel));
