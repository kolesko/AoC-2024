import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const map: string[][] = [];
const directions: Map<string, { x: number; y: number }> = new Map([
  ["^", { x: 0, y: -1 }],
  [">", { x: 1, y: 0 }],
  ["v", { x: 0, y: 1 }],
  ["<", { x: -1, y: 0 }],
]);
const startingPosition = { x: 0, y: 0 };

rl.on("line", (line) => {
  const chars = line.split("");
  map.push(chars);
});

function findStartingPosition() {
  const width = map[0].length;
  const height = map.length;
  var startingPosition = { x: 0, y: 0 };

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      if (Array.from(directions.keys()).includes(map[y][x])) {
        startingPosition.x = x;
        startingPosition.y = y;
        return { startingPosition, width, height };
      }
    }
  }
  return { startingPosition, width, height };
}

function findMoves() {
  const { startingPosition, width, height } = findStartingPosition();
  var cp = { x: startingPosition.x, y: startingPosition.y };
  const visitedPositions: Set<string> = new Set();
  const directionsArray = Array.from(directions.values());
  var directionIndex = Array.from(directions.keys()).findIndex(
    (dir) => dir === map[cp.y][cp.x]
  );
  var cd = directionsArray[directionIndex];

  visitedPositions.add(`${cp.x},${cp.y}`);

  while (cp.x > 0 && cp.y > 0 && cp.x < width - 1 && cp.y < height - 1) {
    if (map[cp.y + cd.y][cp.x + cd.x] === "#") {
      directionIndex += 1;
      cd = directionsArray[directionIndex % directionsArray.length];
    }
    visitedPositions.add(`${cp.x + cd.x},${cp.y + cd.y}`);
    cp.x += cd.x;
    cp.y += cd.y;
  }
  return visitedPositions;
}

rl.on("close", () => {
  console.log("\n");
  // console.log();
  const moves = findMoves();
  console.log(`Sum of moves: ${moves.size}`);
});
