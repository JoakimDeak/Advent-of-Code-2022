const fs = require('fs');

const getInput = () => {
  return fs
    .readFileSync('./input.txt', { encoding: 'utf-8' })
    .split('\r\n')
    .map((line) => line.split(''));
};

const getLabel = (x, y) => {
  return `${x},${y}`;
};

const getHeight = (elevationChar) => {
  return elevationChar === undefined ? elevationChar : elevationChar.charCodeAt(0) + (elevationChar === 'S' ? 14 : elevationChar === 'E' ? 53 : 0) - 97;
};

const canWalk = (currPosition, neighbour) => {
  // they have long fall boots
  return getHeight(currPosition) - getHeight(neighbour) >= -1;
};

const getNeighbours = (x, y, map) => {
  const neighbours = {};
  const currPosition = map[y][x];
  if (canWalk(currPosition, map[y - 1]?.[x])) {
    neighbours[getLabel(x, y - 1)] = 1;
  }
  if (canWalk(currPosition, map[y][x + 1])) {
    neighbours[getLabel(x + 1, y)] = 1;
  }
  if (canWalk(currPosition, map[y + 1]?.[x])) {
    neighbours[getLabel(x, y + 1)] = 1;
  }
  if (canWalk(currPosition, map[y][x - 1])) {
    neighbours[getLabel(x - 1, y)] = 1;
  }
  return neighbours;
};

const buildGraph = (map) => {
  const graph = {};
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      graph[getLabel(x, y)] = getNeighbours(x, y, map);
    }
  }
  return graph;
};

const getNextNode = (distances, visited) => {
  return Object.keys(distances).reduce((min, curr) => ((min === undefined || distances[curr] < distances[min]) && !visited.has(curr) ? curr : min), undefined);
};

const getMinSteps = (graph, startNode, endNode) => {
  const distances = Object.assign({}, graph[startNode]);
  distances[endNode] = Infinity;

  const visited = new Set();
  let currNode = getNextNode(distances, visited);

  while (currNode) {
    const distance = distances[currNode];
    const paths = graph[currNode];

    for (const path in paths) {
      if (path === startNode) {
        continue;
      }
      const newDistance = distance + paths[path];
      if (!distances[path] || distances[path] > newDistance) {
        distances[path] = newDistance;
      }
    }

    visited.add(currNode);
    currNode = getNextNode(distances, visited);
  }
  return { minDistance: distances[endNode], distances };
};

const findSpot = (elevationChar, map) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === elevationChar) {
        return getLabel(x, y);
      }
    }
  }
};
// slow as hell but gets the right answer eventually
const solve = () => {
  const map = getInput();

  const graph = buildGraph(map);

  let startingPoints = [];
  map.forEach((line, y) =>
    line.forEach((point, x) => {
      if (point === 'a' || point === 'S') {
        startingPoints.push(getLabel(x, y));
      }
    })
  );

  const pathLengths = [];

  let i = 0;
  const goal = findSpot('E', map);
  while (i < startingPoints.length) {
    console.log('evaluating starting point', i, '.', startingPoints.length, 'starting points remaining.');
    const result = getMinSteps(graph, startingPoints[i], goal);
    if (result.minDistance === Infinity) {
      const reachablePoints = Object.keys(result.distances).filter((point) => result.distances[point] !== Infinity);
      const lengthBefore = startingPoints.length;
      startingPoints = startingPoints.filter((point) => !reachablePoints.includes(point));
      console.log('Discarding', lengthBefore - startingPoints.length, 'starting points');
    } else {
      pathLengths.push(result.minDistance);
    }
    i++;
  }

  return Math.min(...pathLengths);
};

console.log(solve());
