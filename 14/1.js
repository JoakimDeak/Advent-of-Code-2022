const fs = require('fs');

const getInput = () => {
  return fs
    .readFileSync('./input.txt', { encoding: 'utf-8' })
    .split('\r\n')
    .map((line) =>
      line.split('->').map((val) =>
        val
          .trim()
          .split(',')
          .map((coord) => Number(coord))
      )
    );
};

const set = (cave, x, y, val) => {
  if (!cave[y]) {
    cave[y] = {};
  }
  cave[y][x] = val;
};

const buildCave = (input) => {
  const cave = {};
  input.forEach((path) => {
    for (let i = 0; i < path.length - 1; i++) {
      const [startX, startY] = path[i];
      const [endX, endY] = path[i + 1];
      for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); x++) {
        set(cave, x, startY, '#');
      }
      for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); y++) {
        set(cave, startX, y, '#');
      }
    }
  });
  return cave;
};

const dropSand = (cave, res) => {
  let currX = 500;
  let currY = 0;
  res.settled = false;

  const maxY = Math.max(...Object.keys(cave));

  while (currY < maxY) {
    if (!cave[currY + 1]?.[currX]) {
      currY++;
      continue;
    }
    if (!cave[currY + 1]?.[currX - 1]) {
      currY++;
      currX--;
      continue;
    }
    if (!cave[currY + 1]?.[currX + 1]) {
      currY++;
      currX++;
      continue;
    }

    set(cave, currX, currY, 'o');
    res.sandCount++;
    res.settled = true;
    return res;
  }

  return res;
};

const solve = () => {
  const input = getInput();
  const cave = buildCave(input);
  const res = { sandCount: 0 };
  do {
    dropSand(cave, res);
  } while (res.settled);
  return res.sandCount;
};

console.log(solve());
