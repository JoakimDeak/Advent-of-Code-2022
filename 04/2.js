const fs = require('fs');

const getInput = () => {
  return fs
    .readFileSync('./input.txt', { encoding: 'utf-8' })
    .split('\r\n')
    .map((el) => el.split(/[,-]/).map((el) => Number(el)));
};

const solve = () => {
  const input = getInput();
  let count = 0;
  input.forEach((set) => {
    const range1min = Math.min(...set.slice(0, 2));
    const range1max = Math.max(...set.slice(0, 2));
    const range2min = Math.min(...set.slice(2, 4));
    const range2max = Math.max(...set.slice(2, 4));
    if (
      (range1min >= range2min && range1min <= range2max) ||
      (range1max >= range2min && range1max <= range2max) ||
      (range2min >= range1min && range2min <= range1max) ||
      (range2max >= range1min && range2max <= range1max)
    ) {
      count++;
    }
  });
  return count;
};

console.log(solve());
