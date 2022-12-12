const fs = require('fs');

const getInput = () => {
  const input = fs
    .readFileSync('./input.txt', { encoding: 'utf-8' })
    .split('\r\n')
    .map((line) => line.trim());

  let monkeys = [];
  let currMonkey = '';
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '') {
      monkeys.push(currMonkey);
      currMonkey = '';
    } else {
      currMonkey += input[i] + '\n';
    }
  }
  monkeys.push(currMonkey);
  return monkeys;
};

const createMonkeys = (input) => {
  const monkeys = [];
  input.forEach((monkey) => {
    const lines = monkey.split('\n');

    const number = Number(lines[0].at(-2));
    const items = lines[1]
      .slice(lines[1].indexOf(':') + 1)
      .split(',')
      .map((worryLevel) => Number(worryLevel.trim()));
    const operation = lines[2].slice(lines[2].indexOf('=') + 2);
    const divisibleTest = Number(lines[3].slice(lines[3].indexOf('by') + 3));
    const trueTarget = Number(lines[4].at(-1));
    const falseTarget = Number(lines[5].at(-1));

    monkeys.push({
      number,
      items,
      operation,
      divisibleTest,
      trueTarget,
      falseTarget,
      inspections: 0
    });
  });
  return monkeys;
};

const solve = (rounds, isTooWorried) => {
  const input = getInput();
  const monkeys = createMonkeys(input);

  const commonDenominator = monkeys.reduce((a, b) => a * b.divisibleTest, 1);

  for (let i = 0; i < rounds; i++) {
    monkeys.forEach((monkey) => {
      while (monkey.items.length > 0) {
        monkey.inspections++;
        const old = monkey.items[0];
        let worryLevel = eval(monkey.operation);

        worryLevel = worryLevel % commonDenominator;

        if (!isTooWorried) {
          worryLevel = Math.floor(worryLevel / 3);
        }

        const target = monkeys.find((target) => target.number === (worryLevel % monkey.divisibleTest === 0 ? monkey.trueTarget : monkey.falseTarget));

        target.items.push(worryLevel);
        monkey.items.shift();
      }
    });
  }

  monkeys.sort((a, b) => b.inspections - a.inspections);

  const monkeyBusiness = monkeys[0].inspections * monkeys[1].inspections;

  return monkeyBusiness;
};

// part 1
console.log(solve(20, false));
// part 2
console.log(solve(10000, true));
