import { readFileSync } from "fs";

type Point = { x: number; y: number };

const input = readFileSync(process.env.INPUT_PATH!, "utf-8");
const grid: string[] = [];
const biggerGrid: string[][] = [];
const directions: Map<string, { x: number; y: number }> = new Map([
  ["^", { x: 0, y: -1 }],
  [">", { x: 1, y: 0 }],
  ["v", { x: 0, y: 1 }],
  ["<", { x: -1, y: 0 }],
]);
let moves: string = "";
let startPosition: Point | null = null;
const boxes: Map<string, string> = new Map();
const walls: Set<string> = new Set();

function parseInput() {
  const lines = input.split("\n");
  let firstPart = true;
  for (const line of lines) {
    if (line === "") {
      firstPart = false;
    }
    if (firstPart) {
      grid.push(line);
    }
    if (!firstPart) {
      moves += line;
    }
  }
}

function parseGrid() {
  for (let i = 0; i < grid.length; i++) {
    biggerGrid.push([]);
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "#") {
        biggerGrid[i][j * 2] = "#";
        biggerGrid[i][j * 2 + 1] = "#";
        walls.add(`${j * 2},${i}`).add(`${j * 2 + 1},${i}`);
      }
      if (grid[i][j] === "O") {
        biggerGrid[i][j * 2] = "[";
        biggerGrid[i][j * 2 + 1] = "]";
        boxes.set(`${j * 2},${i}`, "[").set(`${j * 2 + 1},${i}`, "]");
      }
      if (grid[i][j] === "@") {
        biggerGrid[i][j * 2] = "@";
        biggerGrid[i][j * 2 + 1] = ".";
        startPosition = { x: j * 2, y: i };
      }
      if (grid[i][j] === ".") {
        biggerGrid[i][j * 2] = ".";
        biggerGrid[i][j * 2 + 1] = ".";
      }
    }
  }
}

async function simulateMoves() {
  if (!startPosition) {
    throw new Error("No starting position");
  }

  for (const move of moves) {
    const dir = directions.get(move)!;

    const cp: Point = startPosition;

    const np: Point = { x: cp.x + dir.x, y: cp.y + dir.y };

    //WALL IN FRONT OF ROBOT
    if (walls.has(`${np.x},${np.y}`)) {
      continue;
    }

    //FREE SPACE IN FRONT OF ROBOT
    if (!boxes.has(`${np.x},${np.y}`) && !walls.has(`${np.x},${np.y}`)) {
      startPosition = np;
      continue;
    }

    //BOX IN FRONT OF ROBOT
    //MOVE ALL BOXES IN LINE IF THERE IS A FREE SPACE IN FRONT OF THE LAST BOX
    if (boxes.has(`${np.x},${np.y}`)) {
      const moveRobot = moveBoxes(dir, np);
      if (moveRobot) {
        startPosition = moveRobot;
      }
      continue;
    }
  }
}

function moveBoxes(dir: Point, firstBoxPos: Point): Point | undefined {
  let cb: Point = firstBoxPos;

  let boxesToMove: Set<string> = new Set([`${cb.x},${cb.y}`]);
  const movingUp = dir.y === -1;
  const movingDown = dir.y === 1;
  const movingRight = dir.x === 1;
  const movingUpDown = movingUp || movingDown;
  while (true && !movingUpDown) {
    const nb: Point = { x: cb.x + dir.x, y: cb.y + dir.y };

    //IF NEXT POINT IS A FREE SPACE
    if (!boxes.has(`${nb.x},${nb.y}`) && !walls.has(`${nb.x},${nb.y}`)) {
      break;
    }

    //IF NEXT POINT AFTER BOX IS A WALL
    if (walls.has(`${nb.x},${nb.y}`)) {
      return;
    }

    if (boxes.has(`${nb.x},${nb.y}`)) {
      boxesToMove.add(`${nb.x},${nb.y}`);
      cb = nb;
      continue;
    }

    // ..[][][].
    // ...[][]..
    // ....[]...
    // .....@...
  }

  if (movingUpDown) {
    const newBoxes = getBoxesToMove(cb, dir);
    if (newBoxes) {
      boxesToMove = new Set([...boxesToMove, ...newBoxes]);
    } else {
      return;
    }
  }

  //MOVING BOXES TO NEW POSITIONS
  const boxesToMoveArray = Array.from(boxesToMove.values()).sort((a, b) => {
    const [ax, ay] = a.split(",").map((v) => parseInt(v));
    const [bx, by] = b.split(",").map((v) => parseInt(v));

    if (movingUp) {
      return ay - by ? ay - by : ax - bx;
    } else if (movingDown) {
      return by - ay ? by - ay : ax - bx;
    } else if (movingRight) {
      return ay - by ? ay - by : bx - ax;
    } else {
      return ay - by ? ay - by : ax - bx;
    }
  });

  for (let i = 0; i < boxesToMoveArray.length; i++) {
    const box = boxesToMoveArray[i].split(",").map((v) => parseInt(v));
    if (boxes.has(`${box[0]},${box[1]}`)) {
      const boxValue = boxes.get(`${box[0]},${box[1]}`)!;
      if (!movingUpDown) {
        boxes.delete(`${box[0]},${box[1]}`);
        boxes.set(`${box[0] + dir.x},${box[1] + dir.y}`, boxValue);
      }
      if (movingUpDown) {
        if (boxValue === "[") {
          boxes.delete(`${box[0]},${box[1]}`);
          boxes.delete(`${box[0] + 1},${box[1]}`);
          boxes.set(`${box[0] + dir.x},${box[1] + dir.y}`, "[");
          boxes.set(`${box[0] + dir.x + 1},${box[1] + dir.y}`, "]");
        }
        if (boxValue === "]") {
          boxes.delete(`${box[0]},${box[1]}`);
          boxes.delete(`${box[0] - 1},${box[1]}`);
          boxes.set(`${box[0] + dir.x},${box[1] + dir.y}`, "]");
          boxes.set(`${box[0] + dir.x - 1},${box[1] + dir.y}`, "[");
        }
      }
    }
  }

  return firstBoxPos;
}

function getBoxesToMove(sb: Point, dir: Point): Set<string> | undefined {
  let boxesToMove: Set<string> = new Set();
  const val = boxes.get(`${sb.x},${sb.y}`)!;

  if (val === "[") {
    const np1: Point = { x: sb.x, y: sb.y + dir.y };
    const np2: Point = { x: sb.x + 1, y: sb.y + dir.y };
    const canGo = !(
      walls.has(`${np1.x},${np1.y}`) || walls.has(`${np2.x},${np2.y}`)
    );

    if (canGo) {
      boxesToMove.add(`${sb.x},${sb.y}`);
      boxesToMove.add(`${sb.x + 1},${sb.y}`);

      if (boxes.has(`${np1.x},${np1.y}`)) {
        const nextSet = getBoxesToMove(np1, dir);
        if (nextSet) {
          boxesToMove = new Set([...boxesToMove, ...nextSet]);
        } else {
          return;
        }
      }
      if (boxes.has(`${np2.x},${np2.y}`)) {
        const nextSet = getBoxesToMove(np2, dir);
        if (nextSet) {
          boxesToMove = new Set([...boxesToMove, ...nextSet]);
        } else {
          return;
        }
      }
    } else {
      return;
    }
  }
  if (val === "]") {
    const np1: Point = { x: sb.x, y: sb.y + dir.y };
    const np2: Point = { x: sb.x - 1, y: sb.y + dir.y };
    const canGo = !(
      walls.has(`${np1.x},${np1.y}`) || walls.has(`${np2.x},${np2.y}`)
    );

    if (canGo) {
      boxesToMove.add(`${sb.x},${sb.y}`);
      boxesToMove.add(`${sb.x - 1},${sb.y}`);

      if (boxes.has(`${np1.x},${np1.y}`)) {
        const nextSet = getBoxesToMove(np1, dir);
        if (nextSet) {
          boxesToMove = new Set([...boxesToMove, ...nextSet]);
        } else {
          return;
        }
      }
      if (boxes.has(`${np2.x},${np2.y}`)) {
        const nextSet = getBoxesToMove(np2, dir);
        if (nextSet) {
          boxesToMove = new Set([...boxesToMove, ...nextSet]);
        } else {
          return;
        }
      }
    } else {
      return;
    }
  }

  return boxesToMove;
}

function printGrid() {
  let newGrid: string[][] = [];
  const w = biggerGrid[0].length;
  const h = biggerGrid.length;

  for (let i = 0; i < h; i++) {
    newGrid.push([]);
    for (let j = 0; j < w; j++) {
      if (boxes.has(`${j},${i}`)) {
        newGrid[i].push(boxes.get(`${j},${i}`)!);
      } else if (walls.has(`${j},${i}`)) {
        newGrid[i].push("#");
      } else {
        newGrid[i].push(".");
      }
    }
  }

  newGrid[startPosition!.y][startPosition!.x] = "@";

  console.log(newGrid.map((v) => v.join("")).join("\n"));
}

function getSumOfCoordinates() {
  let res = 0;

  boxes.forEach((val, box) => {
    const [x, y] = box.split(",").map((v) => parseInt(v));
    if (val === "[") {
      res += x + y * 100;
    }
  });

  return res;
}

export default function main() {
  parseInput();
  parseGrid();
  simulateMoves();

  // printGrid();

  const sumOfCoordinates = getSumOfCoordinates();

  console.log(`sum of coordinates: ${sumOfCoordinates}`);
}

main();
