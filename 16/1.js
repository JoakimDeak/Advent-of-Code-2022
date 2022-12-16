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
  const TIME_LIMIT = 30;
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

const solve = () => {
  const input = getInput();
  const graph = buildGraph(input);
  return getMaxPressure(graph);
};

console.log(solve());
