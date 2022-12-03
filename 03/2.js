const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const getGroups = (rucksacks) => {
  const groups = [];
  for (let i = 0; i < rucksacks.length; i += 3) {
    groups.push(rucksacks.slice(i, i + 3));
  }
  return groups;
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

const intersectGroup = (group) => {
  const groupArr = group.map((rucksack) => rucksack.split(''));
  return groupArr[0].filter((item) => groupArr[1].includes(item)).filter((item) => groupArr[2].includes(item));
};

const solve = () => {
  const groups = getGroups(getInput());
  return groups.reduce((prioritySum, group) => {
    const badge = intersectGroup(group);
    return getPriority(...badge) + prioritySum;
  }, 0);
};

console.log(intersectGroup(['a', 'a', 'a']));

console.log(solve());
