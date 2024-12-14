import { readFileSync } from "fs";

type Point = { x: number; y: number };

const input = readFileSync(process.env.INPUT_PATH!, "utf-8");
const grid: string[] = [];
const fences: Map<string, number> = new Map();
const pointToArea: Map<string, number> = new Map();
const areas: { [key: string]: Set<string> } = {};
const directions: Point[] = [
  { x: 0, y: 1 }, // down
  { x: 1, y: 0 }, // right
  { x: 0, y: -1 }, // up
  { x: -1, y: 0 }, // left
];
let w = 0;
let h = 0;

function parseInput() {
  const lines = input.split("\n");
  w = lines[0].length;
  for (const line of lines) {
    grid.push(line);
    h++;
  }
}

function countFences(p: Point, pointsInArea: Set<string>) {
  let result = 0;
  for (const dir of directions) {
    const np = { x: p.x + dir.x, y: p.y + dir.y };
    if (
      np.x < 0 ||
      np.y < 0 ||
      np.x >= w ||
      np.y >= h ||
      !pointsInArea.has(`${np.x},${np.y}`)
    ) {
      result++;
    }
  }
  return result;
}

function countAreas(p: Point = { x: 0, y: 0 }, currentArea: number = 0) {
  const currentValue = grid[p.y][p.x];
  if (pointToArea.has(`${p.x},${p.y}`)) {
    return 0;
  }
  pointToArea.set(`${p.x},${p.y}`, currentArea);
  for (const dir of directions) {
    const np = { x: p.x + dir.x, y: p.y + dir.y };
    if (np.x < 0 || np.y < 0 || np.x >= w || np.y >= h) {
      continue;
    }
    const nextValue = grid[np.y][np.x];
    if (nextValue === currentValue) {
      countAreas(np, currentArea);
    }
  }
  return 0;
}

function fillData() {
  let currentArea = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (!pointToArea.has(`${j},${i}`)) {
        countAreas({ x: j, y: i }, currentArea);
        currentArea++;
      }
    }
  }
}

function mapAreasToPoints() {
  pointToArea.forEach((v, k) => {
    const [x, y] = k.split(",").map((v) => parseInt(v));
    const areaCode = v;
    if (!areas[areaCode]) {
      areas[areaCode] = new Set([`${x},${y}`]);
    } else {
      areas[areaCode].add(`${x},${y}`);
    }
  });
}

function countPrice() {
  let price = 0;
  Object.keys(areas).forEach((areaCode) => {
    const area = areas[areaCode];
    let numOfFences = 0;
    area.forEach((point) => {
      const [x, y] = point.split(",").map((v) => parseInt(v));
      numOfFences += countFences({ x, y }, area);
    });
    price += area.size * numOfFences;
    // console.log(`${areaCode}: ${area.size} points, ${numOfFences} fences`);
  });
  return price;
}

export default function main() {
  parseInput();

  fillData();

  mapAreasToPoints();

  const price = countPrice();

  console.log(`price of fences: ${price}`);
}

main();
