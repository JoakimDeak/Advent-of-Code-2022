const fs = require('fs');

const getInput = () => {
  const input = fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
  const newLine = input.indexOf('');
  const start = input.slice(0, newLine);
  const moves = input.splice(newLine + 1, input.length);

  return { start, moves };
};

const getInitialCargoStacks = (start) => {
  const numberOfStacks = (start[0].length + 1) / 4;
  const cargoStacks = [];

  for (let i = 0; i < numberOfStacks; i++) {
    cargoStacks.push([]);
  }

  for (let i = start.length - 2; i >= 0; i--) {
    for (let j = 1; j <= start[0].length - 1; j += 4) {
      const crate = start[i][j];
      if (crate.trim()) {
        const stackIndex = Math.floor(j / 4);
        cargoStacks[stackIndex].push(crate);
      }
    }
  }

  return cargoStacks;
};

const solve = (part) => {
  const { start, moves } = getInput();
  const cargoStacks = getInitialCargoStacks(start);

  moves.forEach((move) => {
    const fromIndex = move.indexOf('from') + 5;
    const from = move.slice(fromIndex, move.indexOf(' ', fromIndex)) - 1;
    const to = move.slice(move.indexOf('to' + 3), move.length) - 1;
    const numberOfCrates = move.slice(5, move.indexOf(' ', 5));

    if (part === 1) {
      for (let i = 0; i < numberOfCrates; i++) {
        cargoStacks[to].push(cargoStacks[from].pop());
      }
    }
    if (part === 2) {
      const fromStackLength = cargoStacks[from].length;
      cargoStacks[to].push(...cargoStacks[from].splice(fromStackLength - numberOfCrates, fromStackLength));
    }
  });

  return cargoStacks.reduce((message, stack, i) => {
    return (message += stack.at(-1));
  }, '');
};

console.log(solve(1));
console.log(solve(2));
