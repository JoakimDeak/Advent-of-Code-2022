const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const arePointsTouching = (a, b) => {
  return (Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) | 0) <= 1;
};

const moveKnots = (lead, next) => {
  if (arePointsTouching(lead, next)) {
    return;
  }
  const leadIsAbove = lead.y - next.y < 0;
  const leadIsToTheRight = lead.x - next.x > 0;

  if (lead.x === next.x) {
    next.y += leadIsAbove ? -1 : 1;
  } else if (lead.y === next.y) {
    next.x += leadIsToTheRight ? 1 : -1;
  } else {
    next.y += leadIsAbove ? -1 : 1;
    next.x += leadIsToTheRight ? 1 : -1;
  }
};

const solve = (knots) => {
  const input = getInput();

  const visitedPositions = new Set(['0,0']);
  const rope = [];
  for (let i = 0; i < knots; i++) {
    rope.push({ x: 0, y: 0 });
  }

  const head = rope.at(0);
  const tail = rope.at(-1);

  input.forEach((instruction) => {
    const times = instruction.substring(1, instruction.length);
    for (let i = 0; i < times; i++) {
      const direction = instruction[0];
      switch (direction) {
        case 'U':
          head.y--;
          break;
        case 'R':
          head.x++;
          break;
        case 'D':
          head.y++;
          break;
        case 'L':
          head.x--;
          break;
      }

      for (let i = 0; i < rope.length - 1; i++) {
        moveKnots(rope[i], rope[i + 1]);
      }

      visitedPositions.add(`${tail.x},${tail.y}`);
    }
  });

  return visitedPositions.size;
};

// part 1
console.log(solve(2));
// part 2
console.log(solve(10));
