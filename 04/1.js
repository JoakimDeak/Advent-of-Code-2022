const fs = require('fs');

const getInput = () => {
  return fs
    .readFileSync('./input.txt', { encoding: 'utf-8' })
    .split('\r\n')
    .map((el) => el.split(/[,-]/).map((el) => Number(el)));
};

const getIndexesOf = (arr, value) => {
  const indexes = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      indexes.push(i);
    }
  }
  return indexes;
};

const solve = () => {
  const input = getInput();
  let count = 0;
  input.forEach((set) => {
    const maxIndexes = getIndexesOf(set, Math.max(...set));
    const minIndexes = getIndexesOf(set, Math.min(...set));
    if ((minIndexes.includes(0) && maxIndexes.includes(1)) || (minIndexes.includes(2) && maxIndexes.includes(3))) {
      count++;
    }
  });
  return count;
};

console.log(solve());
