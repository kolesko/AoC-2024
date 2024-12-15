import { readFileSync } from "fs";

type Point = { x: number; y: number };

const input = readFileSync(process.env.INPUT_PATH!, "utf-8");
const grid: string[] = [];
const directions: Map<string, { x: number; y: number }> = new Map([
  ["^", { x: 0, y: -1 }],
  [">", { x: 1, y: 0 }],
  ["v", { x: 0, y: 1 }],
  ["<", { x: -1, y: 0 }],
]);
let moves: string = "";
let startPosition: Point | null = null;
const boxes: Set<string> = new Set();
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
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "#") {
        walls.add(`${j},${i}`);
      }
      if (grid[i][j] === "O") {
        boxes.add(`${j},${i}`);
      }
      if (grid[i][j] === "@") {
        startPosition = { x: j, y: i };
      }
    }
  }
}

function simulateMoves() {
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
        continue;
      }
    }
  }
}

function moveBoxes(dir: Point, firstBoxPos: Point): Point | undefined {
  let cb: Point = firstBoxPos;

  const boxesToMove: Set<string> = new Set([`${cb.x},${cb.y}`]);
  while (true) {
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
    }
  }

  //MOVING BOXES TO NEW POSITIONS
  for (let i = boxesToMove.size - 1; i >= 0; i--) {
    const box = Array.from(boxesToMove.values())
      [i].split(",")
      .map((v) => parseInt(v));
    if (boxes.has(`${box[0]},${box[1]}`)) {
      boxes.delete(`${box[0]},${box[1]}`);
      boxes.add(`${box[0] + dir.x},${box[1] + dir.y}`);
    }
  }

  return firstBoxPos;
}

function printGrid() {
  let newGrid: string[][] = [];
  const w = grid[0].length;
  const h = grid.length;

  for (let i = 0; i < h; i++) {
    newGrid.push([]);
    for (let j = 0; j < w; j++) {
      if (boxes.has(`${j},${i}`)) {
        newGrid[i].push("O");
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

  boxes.forEach((box) => {
    const [x, y] = box.split(",").map((v) => parseInt(v));
    res += x + y * 100;
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
