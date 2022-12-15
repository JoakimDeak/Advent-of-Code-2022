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

const canBeaconExistAt = (point, sensorData) => {
  const [x, y] = point;
  const isBeacon = sensorData.beacons.some((beacon) => beacon.x === x && beacon.y === y);
  const isInRangeOfSensor = sensorData.sensors.some((sensor) => Math.abs(x - sensor.x) + Math.abs(y - sensor.y) <= sensor.distance);
  return !isBeacon && !isInRangeOfSensor;
};

const getBorderPoints = (sensors) => {
  return sensors.flatMap((sensor) => {
    console.log('getting border points for sensor at', [sensor.x, sensor.y]);

    const points = [];

    const xList = [];
    for (let x = sensor.x - sensor.distance - 1; x <= sensor.x + sensor.distance + 1; x++) {
      xList.push(x);
    }

    let leftX = Math.floor(xList.length / 2);
    let rightX = Math.floor(xList.length / 2);

    for (let y = sensor.y - sensor.distance - 1; y <= sensor.y + sensor.distance + 1; y++) {
      points.push([xList[leftX], y]);
      points.push([xList[rightX], y]);
      if (y < sensor.y) {
        leftX--;
        rightX++;
      } else {
        leftX++;
        rightX--;
      }
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
