const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const getSensorData = (input) => {
  const sensors = [];
  const beacons = [];

  input.forEach((reading) => {
    const regex = /=-?[0-9]*/g;
    const [sensorX, sensorY, beaconX, beaconY] = [...reading.matchAll(regex)].map((match) => Number(match[0].slice(1)));
    const distance = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
    sensors.push({ x: sensorX, y: sensorY, distance });
    beacons.push({ x: beaconX, y: beaconY });
  });

  return { sensors, beacons };
};

const beaconCantExistAt = (point, sensorData) => {
  const [x, y] = point;
  const isBeacon = sensorData.beacons.some((beacon) => beacon.x === x && beacon.y === y);
  if (isBeacon) {
    return false;
  }
  return sensorData.sensors.some((sensor) => Math.abs(x - sensor.x) + Math.abs(y - sensor.y) <= sensor.distance);
};

const getXLimits = (sensors) => {
  return sensors.reduce(
    (limits, curr) => {
      const currMin = curr.x - curr.distance;
      const currMax = curr.x + curr.distance;

      if (currMin < limits.min) {
        limits.min = currMin;
      }
      if (currMax > limits.max) {
        limits.max = currMax;
      }
      return limits;
    },
    { min: Infinity, max: -Infinity }
  );
};

const solve = (targetY) => {
  const input = getInput();
  const sensorData = getSensorData(input);

  const { min, max } = getXLimits(sensorData.sensors);

  let count = 0;
  for (let i = min; i < max; i++) {
    if (beaconCantExistAt([i, targetY], sensorData)) {
      count++;
    }
  }
  return count;
};

console.log(solve(2000000));
