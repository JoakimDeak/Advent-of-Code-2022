const fs = require('fs');

const getInput = () => {
  return fs.readFileSync('./input.txt', { encoding: 'utf-8' }).split('\r\n');
};

class Node {
  constructor(name, type, size, parent) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.parent = parent;
    this.children = [];
  }

  getName() {
    return this.name;
  }

  getDirSize() {
    return this.getAllDescendants().reduce((sum, descendant) => {
      return sum + descendant.getSize();
    }, 0);
  }

  getSize() {
    return Number(this.size ?? 0);
  }

  getParent() {
    return this.parent;
  }

  getChildren() {
    return this.children;
  }

  getChild(name) {
    const foundChild = this.children.find((child) => child.getName() === name);
    if (foundChild) {
      return foundChild;
    }
    this.addChild(name, 'dir');
    return this.getChild(name);
  }

  addChild(name, type, size) {
    this.children.push(new Node(name, type, size, this));
  }

  toString(level = 0) {
    level++;
    let res = '';

    if (this.type === 'dir') {
      res += `- ${this.name} (${this.type})\n`;
    } else {
      res += `- ${this.name} (${this.type}, size=${this.size})\n`;
    }
    this.children.forEach((child) => {
      res += '  '.repeat(level) + child.toString(level);
    });
    return res;
  }

  getAllDescendants(arr = []) {
    arr.push(...this.children);
    this.children.forEach((child) => arr.push(...child.getAllDescendants()));
    return arr;
  }
}

const COMMAND_MARKER = '$';

const constructTree = (input) => {
  const head = new Node('/', 'dir');

  let currentNode = head;
  let isListing = false;

  input.forEach((line) => {
    const parts = line.split(' ');
    const isCommand = parts[0] === COMMAND_MARKER;

    if (isCommand) {
      isListing = false;
      const commandType = parts[1];

      switch (commandType) {
        case 'cd':
          const argument = parts[2];
          switch (argument) {
            case '..':
              currentNode = currentNode.getParent();
              break;
            case '/':
              currentNode = head;
              break;
            default:
              currentNode = currentNode.getChild(argument);
              break;
          }
          break;
        case 'ls':
          isListing = true;
          return;
        default:
          console.error(`unsupported command ${commandType}`);
          return;
      }
      return;
    }

    if (isListing) {
      if (parts[0] === 'dir') {
        currentNode.addChild(parts[1], 'dir');
      } else {
        currentNode.addChild(parts[1], 'file', parts[0]);
      }
    }
  });
  return head;
};

const solve1 = () => {
  const input = getInput();
  const head = constructTree(input);
  return head
    .getAllDescendants()
    .map((node) => node.getDirSize())
    .filter((size) => size <= 100000)
    .reduce((sum, curr) => sum + curr, 0);
};

const solve2 = () => {
  const input = getInput();
  const head = constructTree(input);

  const TOTAL_STORAGE = 70000000;
  const UPDATE_SIZE = 30000000;

  const usedStorage = head.getDirSize();
  const freeSpace = TOTAL_STORAGE - usedStorage;
  const neededSpace = UPDATE_SIZE - freeSpace;

  return head
    .getAllDescendants()
    .map((node) => node.getDirSize())
    .filter((size) => size >= neededSpace)
    .reduce((min, curr) => (curr < min ? curr : min), Number.MAX_VALUE);
};

console.log(solve1());
console.log(solve2());
