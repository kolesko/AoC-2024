import { readFileSync } from "fs";

type Point = { x: number; y: number };

const input = readFileSync(process.env.INPUT_PATH!, "utf-8");
const directions: Point[] = [
  { x: 0, y: 1 }, // down
  { x: 1, y: 0 }, // right
  { x: 0, y: -1 }, // up
  { x: -1, y: 0 }, // left
];
const grid: number[][] = [];
let w = 0;
let h = 0;
const startingPoints: Point[] = [];

function parseInput() {
  for (const line of input.split("\n")) {
    const row: number[] = [];
    w = 0;
    for (const char of line) {
      if (char === "0") {
        startingPoints.push({ x: w, y: h });
      }
      row.push(char === "." ? 99 : parseInt(char));
      w++;
    }
    grid.push(row);
    h++;
  }
}

function findPath(cp: Point, seen: Set<string> = new Set()): number {
  let result = 0;
  const currentValue = grid[cp.y][cp.x];
  if (seen.has(`${cp.x},${cp.y}`)) {
    return 0;
  }
  seen.add(`${cp.x},${cp.y}`);
  if (currentValue === 9) {
    return 1;
  }
  for (const dir of directions) {
    const np = { x: cp.x + dir.x, y: cp.y + dir.y };
    if (np.x < 0 || np.y < 0 || np.x >= w || np.y >= h) {
      continue;
    }
    const nextValue = grid[np.y][np.x];
    if (nextValue - currentValue === 1) {
      result += findPath(np, seen);
    }
  }
  return result;
}

function solve() {
  let score = 0;
  startingPoints.forEach((startingPoint) => {
    const x = findPath(startingPoint);
    score += x;
  });
  return score;
}

export default function main() {
  parseInput();

  const count = solve();
  console.log(count);
}

main();
