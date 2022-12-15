const fs = require('fs');
console.log;

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

const getSensorData = (input) => {
  const sensors = [];
  const beacons = [];
  const regex = /-?[0-9]+/g;

  input.forEach((reading) => {
    const [sensorX, sensorY, beaconX, beaconY] = reading.match(regex).map(Number);
    const distance = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
    sensors.push({ x: sensorX, y: sensorY, distance });
    beacons.push({ x: beaconX, y: beaconY });
  });

  return { sensors, beacons };
};

const canBeaconExistAt = (point, sensorData) => {
  const [x, y] = point;
  const isBeacon = sensorData.beacons.some((beacon) => beacon.x === x && beacon.y === y);
  const isInRangeOfSensor = sensorData.sensors.some((sensor) => Math.abs(x - sensor.x) + Math.abs(y - sensor.y) <= sensor.distance);
  return !isBeacon && !isInRangeOfSensor;
};

const getBorderPoints = (sensors) => {
  return sensors.flatMap((sensor) => {
    const { x: sx, y: sy, distance: sd } = sensor;
    console.log('getting border points for sensor at', [sx, sy]);

    const xList = [];
    for (let x = sx - sd - 1; x <= sx + sd + 1; x++) {
      xList.push(x);
    }

    let lx = (rx = xList.length / 2);

    const points = [];
    for (let y = sy - sd - 1; y <= sy + sd + 1; y++) {
      points.push([xList.at(lx), y]);
      points.push([xList.at(rx), y]);

      lx += y < sy ? -1 : 1;
      rx += y < sy ? 1 : -1;
    }
    return points;
  });
};

const solve = () => {
  const input = getInput();
  const sensorData = getSensorData(input);

  let found;

  let i = 0;
  while (!found && i < sensorData.sensors.length) {
    const borderPoints = getBorderPoints([sensorData.sensors[i]]);
    let j = 0;
    while (!found && j < borderPoints.length) {
      const [x, y] = borderPoints[j];
      if (!(x < 0 || x >= 4000000 || y < 0 || y >= 4000000) && canBeaconExistAt(borderPoints[j], sensorData)) {
        found = borderPoints[j];
      }
      j++;
    }
    i++;
  }
  console.log('found', found);
  const [x, y] = found;
  const tuningFrequency = x * 4000000 + y;
  return tuningFrequency;
};

console.log(solve());
