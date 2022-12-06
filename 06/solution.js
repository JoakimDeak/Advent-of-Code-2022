const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' });
};

const solve = (markerLength) => {
  const input = getInput();
  const buffer = [];

  for (let i = 0; i < input.length; i++) {
    buffer.push(input[i]);
    if (buffer.length > markerLength) {
      buffer.shift();
    }
    if (new Set(buffer).size === markerLength) {
      return i + 1;
    }
  }
};

// part 1
console.log(solve(4));
// part 2
console.log(solve(14));
