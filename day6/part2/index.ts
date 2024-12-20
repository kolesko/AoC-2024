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

function findObstructions() {
  const { startingPosition, width, height } = findStartingPosition();
  var cp = { x: startingPosition.x, y: startingPosition.y };
  const visitedPositions: Set<string> = new Set();
  const directionsArray = Array.from(directions.values());
  var directionIndex = Array.from(directions.keys()).findIndex(
    (dir) => dir === map[cp.y][cp.x]
  );
  var cd = directionsArray[directionIndex];

  while (cp.x > 0 && cp.y > 0 && cp.x < width - 1 && cp.y < height - 1) {
    if (map[cp.y + cd.y][cp.x + cd.x] === "#") {
      directionIndex += 1;
      cd = directionsArray[directionIndex % directionsArray.length];
    }
    if (
      !(
        cp.x + cd.x === startingPosition.x && cp.y + cd.y === startingPosition.y
      )
    ) {
      visitedPositions.add(`${cp.x + cd.x},${cp.y + cd.y}`);
    }
    cp.x += cd.x;
    cp.y += cd.y;
  }
  return visitedPositions;
}

// finding loops by checking if the current position was already visited in same direction
// before I had there array of object that represented the visited positions and it was slower
// switching to a set of string and checking if the string is in the set is faster
function findLoops(obstructions: Set<string>) {
  var loops = 0;
  const { startingPosition, width, height } = findStartingPosition();
  const directionsArray = Array.from(directions.values());
  obstructions.forEach((obs) => {
    const [ox, oy] = obs.split(",").map(Number);
    var cp = { x: startingPosition.x, y: startingPosition.y };
    const visitedPositions: Set<string> = new Set();
    var directionIndex = Array.from(directions.keys()).findIndex(
      (dir) => dir === map[cp.y][cp.x]
    );
    var cd = directionsArray[directionIndex];

    while (cp.x > 0 && cp.y > 0 && cp.x < width - 1 && cp.y < height - 1) {
      const currentPosition = {
        x: cp.x,
        y: cp.y,
        direction: Array.from(directions.keys())[
          directionIndex % directionsArray.length
        ],
      };
      if (
        visitedPositions.has(
          `${currentPosition.x},${currentPosition.y},${currentPosition.direction}`
        )
      ) {
        loops++;
        break;
      }
      visitedPositions.add(
        `${currentPosition.x},${currentPosition.y},${currentPosition.direction}`
      );
      if (
        map[cp.y + cd.y][cp.x + cd.x] === "#" ||
        (ox === cp.x + cd.x && oy === cp.y + cd.y)
      ) {
        directionIndex += 1;
        cd = directionsArray[directionIndex % directionsArray.length];
      } else {
        cp.x += cd.x;
        cp.y += cd.y;
      }
    }
  });
  return loops;
}

// faster because you don't need to store the visited positions, it's slowing down the program
// only checking if the number of moves are bigger than free space "." + 1
// + 1 is the overlaping check because if you go through all the free spaces and then go another round you are surely in loop
function findLoopsFaster(obstructions: Set<string>) {
  var loops = 0;
  const { startingPosition, width, height } = findStartingPosition();
  const directionsArray = Array.from(directions.values());
  obstructions.forEach((obs) => {
    const [ox, oy] = obs.split(",").map(Number);
    var cp = { x: startingPosition.x, y: startingPosition.y };
    var directionIndex = Array.from(directions.keys()).findIndex(
      (dir) => dir === map[cp.y][cp.x]
    );
    var cd = directionsArray[directionIndex];
    var moves = 0;
    while (cp.x > 0 && cp.y > 0 && cp.x < width - 1 && cp.y < height - 1) {
      if (moves === width * height - obstructions.size + 1) {
        loops++;
        break;
      }
      moves++;
      if (
        map[cp.y + cd.y][cp.x + cd.x] === "#" ||
        (ox === cp.x + cd.x && oy === cp.y + cd.y)
      ) {
        directionIndex += 1;
        cd = directionsArray[directionIndex % directionsArray.length];
      } else {
        cp.x += cd.x;
        cp.y += cd.y;
      }
    }
  });
  return loops;
}

rl.on("close", () => {
  console.log("\n");
  const obstruction = findObstructions();

  const loops = findLoopsFaster(obstruction);
  console.log(`loops: ${loops}`);
});
