const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const getPriority = (item) => {
  const charCode = item.charCodeAt(0);
  if (charCode >= 97 && charCode <= 122) {
    return charCode - 96;
  }
  if (charCode >= 65 && charCode <= 90) {
    return charCode - 38;
  }
};

const solve = () => {
  const input = getInput();
  return input.reduce((prioritySum, rucksack) => {
    const firstCompartment = rucksack.slice(0, rucksack.length / 2).split('');
    const secondCompartment = rucksack.slice(rucksack.length / 2).split('');
    const duplicate = firstCompartment.find((item) => secondCompartment.includes(item));
    return prioritySum + (duplicate === undefined ? 0 : getPriority(duplicate));
  }, 0);
};

console.log(solve());
