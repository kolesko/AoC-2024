import { readFileSync } from "fs";

type Point = { x: number; y: number };
type PointWithVisited = { point: Point; visited: Set<string> };

export default function main() {
  const input = readFileSync(process.env.INPUT_PATH!, "utf-8");
  const grid: number[][] = [];
  const startingPoints: Point[] = [];
  const directions: Point[] = [
    { x: 0, y: 1 }, // down
    { x: 1, y: 0 }, // right
    { x: 0, y: -1 }, // up
    { x: -1, y: 0 }, // left
  ];
  let w = 0;
  let h = 0;

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

  function findPath(
    startingPoint: Point,
    direction: Point,
    prevValue: number,
    visited: PointWithVisited[],
    heads: Set<string>
  ) {
    const vInd = visited.findIndex(
      (v) => v.point.x === startingPoint.x && v.point.y === startingPoint.y
    );
    if (vInd === -1) {
      visited.push({ point: startingPoint, visited: new Set() });
    }
    const newPoint = {
      x: startingPoint.x + direction.x,
      y: startingPoint.y + direction.y,
    };
    if (
      newPoint.x < 0 ||
      newPoint.x >= w ||
      newPoint.y < 0 ||
      newPoint.y >= h
    ) {
      return false;
    }
    const addToVisited = `${newPoint.x},${newPoint.y}`;
    const visitedSet = visited.find(
      (v) => v.point.x === startingPoint.x && v.point.y === startingPoint.y
    )?.visited;
    if (visitedSet?.has(addToVisited)) {
      return false;
    }
    if (visitedSet) {
      visitedSet.add(addToVisited);
    }
    if (prevValue === 8 && grid[newPoint.y][newPoint.x] === 9) {
      heads.add(`${newPoint.x},${newPoint.y}`);
      return true;
    }
    if (grid[newPoint.y][newPoint.x] - prevValue !== 1) {
      return false;
    }
    if (grid[newPoint.y][newPoint.x] - prevValue === 1) {
      for (const newDir of directions.filter(
        (d) => !(d.x === -direction.x && d.y === -direction.y)
      )) {
        findPath(
          newPoint,
          newDir,
          grid[newPoint.y][newPoint.x],
          visited,
          heads
        );
      }
    }
    return false;
  }

  function solve() {
    let score = 0;
    startingPoints.forEach((startingPoint, i) => {
      const visited: PointWithVisited[] = [];
      let result: Set<string> = new Set();
      for (const direction of directions) {
        findPath(startingPoint, direction, 0, visited, result);
      }
      score += result.size;
    });
    return score;
  }

  parseInput();

  const count = solve();
  console.log(count);
}

main();
