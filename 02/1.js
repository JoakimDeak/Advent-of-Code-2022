const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const shapePoints = {
  rock: 1,
  paper: 2,
  scissors: 3
};

const getMove = (code) => {
  switch (code) {
    case 'A':
    case 'X':
      return 'rock';
    case 'B':
    case 'Y':
      return 'paper';
    case 'C':
    case 'Z':
      return 'scissors';
  }
};

const getWinPoints = (opponentMove, yourMove) => {
  if (opponentMove === yourMove) {
    return 3;
  }
  if (yourMove === 'rock') {
    return opponentMove === 'paper' ? 0 : 6;
  }
  if (yourMove === 'paper') {
    return opponentMove === 'scissors' ? 0 : 6;
  }
  if (yourMove === 'scissors') {
    return opponentMove === 'rock' ? 0 : 6;
  }
};

const solve = () => {
  const input = getInput();
  return input.reduce((score, round) => {
    const opponentMove = getMove(round[0]);
    const yourMove = getMove(round[2]);
    return score + getWinPoints(opponentMove, yourMove) + shapePoints[yourMove];
  }, 0);
};

console.log(solve());
