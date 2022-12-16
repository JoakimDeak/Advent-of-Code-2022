const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const buildGraph = (input) => {
  const graph = input.reduce((graph, line) => {
    const [valve, flow, ...destinations] = line.match(/[A-Z]{2}|[0-9]+/g);
    graph[valve] = { valve, flow: Number(flow), destinations };
    return graph;
  }, {});

  Object.values(graph).forEach((valve) => {
    addWeightedEdges(graph, valve);
  });

  return graph;
};

const addWeightedEdges = (graph, node) => {
  const queue = [];
  const visited = new Set();
  node.edges = {};
  queue.push(node);
  visited.add(node.valve);
  while (queue.length > 0) {
    const currNode = queue.shift();
    currNode.destinations.forEach((valve) => {
      if (!visited.has(valve)) {
        visited.add(valve);
        node.edges[valve] = (node.edges[currNode.valve] || 0) + 1;
        queue.push(graph[valve]);
      }
    });
  }
};

const getMaxPressure = (graph) => {
  const TIME_LIMIT = 26;
  const queue = [];
  let maxPressure = 0;

  const root = {
    valve: 'AA',
    timeElapsed: 0,
    pressure: 0,
    openValves: []
  };
  queue.push(root);

  while (queue.length > 0) {
    const curr = queue.shift();

    const options = Object.keys(graph).filter((valve) => graph[valve].flow > 0 && !curr.openValves.includes(valve));

    if (options.length === 0) {
      if (maxPressure < curr.pressure) {
        maxPressure = curr.pressure;
      }
      continue;
    }

    options.forEach((option) => {
      const cost = graph[curr.valve].edges[option] + 1;
      if (curr.timeElapsed + cost >= TIME_LIMIT) {
        if (maxPressure < curr.pressure) {
          maxPressure = curr.pressure;
        }
      } else {
        const newTime = curr.timeElapsed + cost;
        queue.push({
          valve: option,
          timeElapsed: newTime,
          pressure: curr.pressure + (TIME_LIMIT - newTime) * graph[option].flow,
          openValves: [...curr.openValves, option]
        });
      }
    });
  }
  return maxPressure;
};

const findAllSubsets = (arr) => {
  arr.sort();
  const res = [[]];
  let count, subRes, preLength;
  for (let i = 0; i < arr.length; i++) {
    count = 1;
    while (arr[i + 1] && arr[i + 1] == arr[i]) {
      count += 1;
      i++;
    }
    preLength = res.length;
    for (let j = 0; j < preLength; j++) {
      subRes = res[j].slice();
      for (let x = 1; x <= count; x++) {
        if (x > 0) subRes.push(arr[i]);
        res.push(subRes.slice());
      }
    }
  }
  return res.filter((combo) => combo.length > 0 && combo.length < arr.length);
};

const useHelper = (graph, myValves, elValves) => {
  const myGraph = myValves.reduce((myGraph, valve) => {
    myGraph[valve] = graph[valve];
    return myGraph;
  }, {});
  const elGraph = elValves.reduce((elGraph, valve) => {
    elGraph[valve] = graph[valve];
    return elGraph;
  }, {});

  myGraph['AA'] = graph['AA'];
  elGraph['AA'] = graph['AA'];

  return getMaxPressure(myGraph) + getMaxPressure(elGraph);
};

const solve = () => {
  const input = getInput();
  const graph = buildGraph(input);

  const goodValves = Object.keys(graph).filter((valve) => graph[valve].flow > 0);

  const subsets = findAllSubsets(goodValves);

  const res = [];
  for (let i = 0; i < subsets.length / 2; i++) {
    // for valves: AA, BB, CC if subset.at(0) is AA then subset.at(-(0+1)) will be BB, CC
    res.push(useHelper(graph, subsets.at(i), subsets.at(-(i + 1))));
  }

  return Math.max(...res);
};

console.log(solve());
