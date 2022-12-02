const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const moves = ['A', 'B', 'C'];

const shapePoints = {
  A: 1,
  B: 2,
  C: 3
};

const solve = () => {
  const input = getInput();
  const score = input.reduce((score, round) => {
    const opponentMoveIndex = moves.indexOf(round[0]);
    const outcome = round[2];
    switch (outcome) {
      // lose
      case 'X':
        return shapePoints[moves.at(opponentMoveIndex - 1)] + score;
      // draw
      case 'Y':
        return shapePoints[moves.at(opponentMoveIndex)] + score + 3;
      // win
      case 'Z':
        return shapePoints[moves.at((opponentMoveIndex + 1) % 3)] + score + 6;
    }
  }, 0);
  return score;
};

console.log(solve());
