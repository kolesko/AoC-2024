import { readFileSync } from "fs";

type Point = { x: number; y: number };
type Robot = { start: Point; v: Point };

// const w = 11;
// const h = 7;

const w = 101;
const h = 103;

const robots: Robot[] = [];

const input = readFileSync(process.env.INPUT_PATH!, "utf-8");
function parseInput() {
  const lines = input.split("\n");
  for (const line of lines) {
    const [[sx, sy], [vx, vy]] = line.split(" ").map((v) =>
      v
        .split("=")[1]
        .split(",")
        .map((v) => parseInt(v))
    );
    const robot = { start: { x: sx, y: sy }, v: { x: vx, y: vy } };
    robots.push(robot);
  }
}

function findEndPosition(robot: Robot, numOfMoves = 0): Point {
  const { start, v } = robot;
  const endX = start.x + v.x * numOfMoves;
  const endY = start.y + v.y * numOfMoves;

  let realEndX = endX;
  let realEndY = endY;

  if (endX >= w) {
    realEndX = realEndX % w;
  }
  if (endY >= h) {
    realEndY = realEndY % h;
  }
  if (endX < 0) {
    const addW = Math.ceil(-endX / w);
    realEndX = realEndX + addW * w;
  }
  if (endY < 0) {
    const addH = Math.ceil(-endY / h);
    realEndY = realEndY + addH * h;
  }
  return { x: realEndX, y: realEndY };
}

function partOfQuadrant(p: Point) {
  const middleX = Math.floor(w / 2);
  const middleY = Math.floor(h / 2);
  if (p.x < middleX && p.y < middleY) {
    return 1;
  }
  if (p.x > middleX && p.y < middleY) {
    return 2;
  }
  if (p.x < middleX && p.y > middleY) {
    return 3;
  }
  if (p.x > middleX && p.y > middleY) {
    return 4;
  }
  return null;
}

function getSafetyFactor() {
  const numOfRobotsInQuadrant = new Map<number, number>();
  for (const robot of robots) {
    const endPosition = findEndPosition(robot, 100);
    const quadrant = partOfQuadrant(endPosition);
    if (quadrant === null) {
      continue;
    }
    if (!numOfRobotsInQuadrant.has(quadrant)) {
      numOfRobotsInQuadrant.set(quadrant, 1);
    } else {
      numOfRobotsInQuadrant.set(
        quadrant,
        numOfRobotsInQuadrant.get(quadrant)! + 1
      );
    }
  }
  return Array.from(numOfRobotsInQuadrant.values()).reduce((a, b) => a * b, 1);
}

export default function main() {
  parseInput();

  const safetyFactor = getSafetyFactor();
  console.log(`safety factor`, safetyFactor);
}

main();
