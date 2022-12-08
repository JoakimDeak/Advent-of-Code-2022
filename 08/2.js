const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const getScenicScore = (x, y, map) => {
  const getViewDistanceTop = () => {
    let viewDistance = 0;
    for (let scanY = y - 1; scanY >= 0; scanY--) {
      viewDistance++;
      if (map[scanY][x] >= map[y][x]) {
        return viewDistance;
      }
    }
    return viewDistance;
  };
  const getViewDistanceRight = () => {
    let viewDistance = 0;
    for (let scanX = x + 1; scanX < map[0].length; scanX++) {
      viewDistance++;
      if (map[y][scanX] >= map[y][x]) {
        return viewDistance;
      }
    }
    return viewDistance;
  };
  const getViewDistanceBottom = () => {
    let viewDistance = 0;
    for (let scanY = y + 1; scanY < map.length; scanY++) {
      viewDistance++;
      if (map[scanY][x] >= map[y][x]) {
        return viewDistance;
      }
    }
    return viewDistance;
  };
  const getViewDistanceLeft = () => {
    let viewDistance = 0;
    for (let scanX = x - 1; scanX >= 0; scanX--) {
      viewDistance++;
      if (map[y][scanX] >= map[y][x]) {
        return viewDistance;
      }
    }
    return viewDistance;
  };

  return getViewDistanceTop() * getViewDistanceRight() * getViewDistanceBottom() * getViewDistanceLeft();
};

const solve = () => {
  const map = getInput();
  const scenicScores = [];

  const width = map[0].length;
  const height = map.length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      scenicScores.push(getScenicScore(x, y, map));
    }
  }

  return Math.max(...scenicScores);
};

console.log(solve());
