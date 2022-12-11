const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const solve = () => {
  const input = getInput();
  let register = 1;
  let cycle = 0;
  let i = 0;
  let executionCycle = 0;
  const signalStrengths = [];
  while (i < input.length) {
    cycle++;
    const [operation, V] = input[i].split(' ');
    if ((cycle + 20) % 40 === 0) {
      signalStrengths.push(register * cycle);
    }
    switch (operation) {
      case 'noop':
        i++;
        break;
      case 'addx':
        executionCycle++;
        if (executionCycle === 2) {
          register += Number(V);
          i++;
          executionCycle = 0;
        }
        break;
    }
  }
  return signalStrengths.reduce((sum, curr) => sum + curr);
};

console.log(solve());
