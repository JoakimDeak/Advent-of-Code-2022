const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const sum = (elements) => {
  return elements.reduce((sum, el) => sum + el, 0);
};

const createInventories = (input) => {
  const inventories = [];
  let temp = [];
  input.forEach((line) => {
    if (line) {
      temp.push(Number(line));
    } else {
      inventories.push(temp);
      temp = [];
    }
  });
  if (temp.length > 0) {
    inventories.push(temp);
  }
  return inventories;
};

const solve1 = () => {
  const inventories = createInventories(getInput());

  const max = inventories.reduce((max, curr) => {
    const totalCalories = sum(curr);
    return totalCalories > max ? totalCalories : max;
  }, 0);
  return max;
};

const solve2 = () => {
  const inventories = createInventories(getInput());

  inventories.sort((a, b) => sum(b) - sum(a));
  const topThree = inventories.slice(0, 3);
  const totalSum = topThree.reduce((total, curr) => total + sum(curr), 0);
  return totalSum;
};

console.log('part 1', solve1());
console.log('part 2', solve2());
