const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const solve = () => {
  const instructions = getInput();

  let spritePosition = 1;
  let cycle = 0;

  let i = 0;
  let executionCycle = 0;

  let line = '';
  let output = '';

  while (i < instructions.length) {
    cycle++;

    line += Math.abs(spritePosition - ((cycle - 1) % 40)) <= 1 ? '#' : '.';

    const [operation, parameter] = instructions[i].split(' ');
    if (operation === 'addx') {
      executionCycle++;
      if (executionCycle === 2) {
        spritePosition += Number(parameter);
        i++;
        executionCycle = 0;
      }
    } else {
      i++;
    }

    if (cycle % 40 === 0) {
      output += line + '\n';
      line = '';
    }
  }
  return output;
};

console.log(solve());
