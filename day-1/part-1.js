console.log(input.trim().split('\n').map(line => Math.floor(line / 3) - 2).reduce((sum, fuel) => sum + fuel));
