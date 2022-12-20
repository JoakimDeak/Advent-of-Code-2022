const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('');
};

const createRock = (type) => {
  switch (type) {
    // -
    case 0:
      return [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0]
      ];
    // +
    case 1:
      return [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2]
      ];
    // L
    case 2:
      return [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1],
        [2, 2]
      ];
    // |
    case 3:
      return [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3]
      ];
    // []
    case 4:
      return [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1]
      ];
  }
};

const shiftRock = (rock, direction, amount = 1) => {
  rock.forEach(([x, y], i) => {
    switch (direction) {
      case 'up':
        rock[i] = [x, y + amount];
        break;
      case 'right':
        rock[i] = [x + amount, y];
        break;
      case 'down':
        rock[i] = [x, y - amount];
        break;
      case 'left':
        rock[i] = [x - amount, y];
        break;
    }
  });
};

const getMaxY = (tower) => {
  return [...tower].reduce((max, point) => {
    const y = Number(point.split(',')[1]);
    return max < y ? y : max;
  }, -1);
};

const settleRock = (rock, tower) => {
  rock.forEach(([x, y]) => {
    tower.add(`${x},${y}`);
  });
};

const setMinY = (rock, targetY) => {
  const currMin = rock.reduce((min, [_, y]) => (y < min ? y : min), Infinity);
  const diff = targetY - currMin;
  shiftRock(rock, 'up', diff);
};

const wouldCollide = (rock, tower, direction) => {
  return rock.some(([x, y]) => {
    switch (direction) {
      case 'up':
        return tower.has(`${x},${y + 1}`);
      case 'right':
        return tower.has(`${x + 1},${y}`) || x + 1 > 6;
      case 'down':
        return tower.has(`${x},${y - 1}`) || y - 1 < 0;
      case 'left':
        return tower.has(`${x - 1},${y}`) || x - 1 < 0;
    }
  });
};

const solve = () => {
  const jets = getInput();
  const tower = new Set();

  let rockType = 0;
  let jetIndex = 0;
  for (let i = 0; i < 2022; i++) {
    let settled = false;

    const rock = createRock(rockType);
    rockType = (rockType + 1) % 5;
    shiftRock(rock, 'right', 2);
    setMinY(rock, getMaxY(tower) + 4);

    while (!settled) {
      const pushDirection = jets[jetIndex] === '<' ? 'left' : 'right';
      jetIndex = (jetIndex + 1) % jets.length;
      if (!wouldCollide(rock, tower, pushDirection)) {
        shiftRock(rock, pushDirection);
      }
      if (wouldCollide(rock, tower, 'down')) {
        settleRock(rock, tower);
        settled = true;
      } else {
        shiftRock(rock, 'down');
      }
    }
  }
  return getMaxY(tower) + 1;
};

console.log(solve());
