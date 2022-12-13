const fs = require('fs');

const getInput = () => {
  return fs
    .readFileSync('./input.txt', { encoding: 'utf-8' })
    .split('\r\n\r\n')
    .map((el) => el.split('\r\n').map((el) => JSON.parse(el)));
};

const compare = (left, right) => {
  const isLeftNumber = typeof left === 'number';
  const isRightNumber = typeof right === 'number';

  if (isLeftNumber && isRightNumber) {
    return left - right;
  }

  if (isLeftNumber || isRightNumber) {
    return compare(isLeftNumber ? [left] : left, isRightNumber ? [right] : right);
  }

  const n = Math.min(left.length, right.length);
  for (let i = 0; i < n; i++) {
    const res = compare(left[i], right[i]);
    if (res !== 0) {
      return res;
    }
  }

  return left.length - right.length;
};

const solve1 = () => {
  const packetPairs = getInput();
  return packetPairs.map(([left, right], i) => (compare(left, right) <= 0 ? i + 1 : 0)).reduce((sum, curr) => sum + curr, 0);
};

function solve2() {
  const packets = getInput().flat();

  const dividerPackets = [[[2]], [[6]]];

  packets.push(...dividerPackets);

  packets.sort(compare);

  return dividerPackets
    .map((divider) => packets.findIndex((packet) => JSON.stringify(packet) === JSON.stringify(divider)) + 1)
    .reduce((product, curr) => product * curr, 1);
}

// part 1
console.log(solve1());

// part2
console.log(solve2());
