const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const isTreeVisible = (x, y, map) => {
  const isVisibleFromTop = () => {
    for (let scanY = y - 1; scanY >= 0; scanY--) {
      if (map[scanY][x] >= map[y][x]) {
        return false;
      }
    }
    return true;
  };
  const isVisibleFromRight = () => {
    for (let scanX = x + 1; scanX < map[0].length; scanX++) {
      if (map[y][scanX] >= map[y][x]) {
        return false;
      }
    }
    return true;
  };
  const isVisibleFromBottom = () => {
    for (let scanY = y + 1; scanY < map.length; scanY++) {
      if (map[scanY][x] >= map[y][x]) {
        return false;
      }
    }
    return true;
  };
  const isVisibleFromLeft = () => {
    for (let scanX = x - 1; scanX >= 0; scanX--) {
      if (map[y][scanX] >= map[y][x]) {
        return false;
      }
    }
    return true;
  };

  return isVisibleFromTop() || isVisibleFromRight() || isVisibleFromBottom() || isVisibleFromLeft();
};

const solve = () => {
  const map = getInput();
  let visibleTrees = 0;

  const width = map[0].length;
  const height = map.length;
  visibleTrees += width * 2 + (height - 2) * 2;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (isTreeVisible(x, y, map)) {
        visibleTrees++;
      }
    }
  }

  return visibleTrees;
};

console.log(solve());
