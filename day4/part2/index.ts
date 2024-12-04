import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const crisCross: string[][] = [];
const WORD_TO_SEARCH = "MAS";

rl.on("line", (line) => {
  crisCross.push(line.split(""));
});

type pointsType = {
  start: [number, number];
  end: [number, number];
  mid: [number, number];
};

function searchDiagonal(positionX: number, positionY: number) {
  const width = crisCross[0].length;
  const height = crisCross.length;
  var points: pointsType[] = [];

  //SEARCH TOP RIGHT
  if (
    positionX <= width - WORD_TO_SEARCH.length &&
    positionY >= WORD_TO_SEARCH.length - 1
  ) {
    var indexInLetter = 1;
    var match = true;
    var endPosition = [positionX, positionY];
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY - i][positionX + i] ===
        WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
        endPosition = [positionX + i, positionY - i];
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      indexInLetter = 1;
      points.push({
        start: [positionX, positionY],
        end: [endPosition[0], endPosition[1]],
        mid: [
          (positionX + endPosition[0]) / 2,
          (positionY + endPosition[1]) / 2,
        ],
      });
    }
  }

  //SEARCH TOP LEFT
  if (
    positionX >= WORD_TO_SEARCH.length - 1 &&
    positionY >= WORD_TO_SEARCH.length - 1
  ) {
    var indexInLetter = 1;
    var match = true;
    var endPosition = [positionX, positionY];
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY - i][positionX - i] ===
        WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
        endPosition = [positionX - i, positionY - i];
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      indexInLetter = 1;
      points.push({
        start: [positionX, positionY],
        end: [endPosition[0], endPosition[1]],
        mid: [
          (positionX + endPosition[0]) / 2,
          (positionY + endPosition[1]) / 2,
        ],
      });
    }
  }

  //SEARCH BOTTOM RIGHT
  if (
    positionX <= width - WORD_TO_SEARCH.length &&
    positionY <= height - WORD_TO_SEARCH.length
  ) {
    var indexInLetter = 1;
    var match = true;
    var endPosition = [positionX, positionY];
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY + i][positionX + i] ===
        WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
        endPosition = [positionX + i, positionY + i];
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      indexInLetter = 1;
      points.push({
        start: [positionX, positionY],
        end: [endPosition[0], endPosition[1]],
        mid: [
          (positionX + endPosition[0]) / 2,
          (positionY + endPosition[1]) / 2,
        ],
      });
    }
  }

  //SEARCH BOTTOM LEFT
  if (
    positionX >= WORD_TO_SEARCH.length - 1 &&
    positionY <= height - WORD_TO_SEARCH.length
  ) {
    var indexInLetter = 1;
    var match = true;
    var endPosition = [positionX, positionY];
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY + i][positionX - i] ===
        WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
        endPosition = [positionX - i, positionY + i];
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      indexInLetter = 1;
      points.push({
        start: [positionX, positionY],
        end: [endPosition[0], endPosition[1]],
        mid: [
          (positionX + endPosition[0]) / 2,
          (positionY + endPosition[1]) / 2,
        ],
      });
    }
  }

  return points;
}

function isPerpendicular(point1: pointsType, point2: pointsType) {
  if (!(point1.mid[0] === point2.mid[0] && point1.mid[1] === point2.mid[1])) {
    return false;
  }
  const m1 =
    (point1.end[1] - point1.start[1]) / (point1.end[0] - point1.start[0]);
  const m2 =
    (point2.end[1] - point2.start[1]) / (point2.end[0] - point2.start[0]);

  if (m1 * m2 === -1) {
    return true;
  }

  return false;
}

function countPerpendicular(points: pointsType[]) {
  const copyOfPoints = points.slice();
  var count = 0;
  while (copyOfPoints.length > 0) {
    const currPoint = copyOfPoints.shift() as pointsType;
    const pointsToCheck = copyOfPoints.filter((point) => {
      return (
        point.mid[0] === currPoint.mid[0] && point.mid[1] === currPoint.mid[1]
      );
    });
    pointsToCheck.forEach((point) => {
      if (isPerpendicular(currPoint, point)) {
        count++;
      }
    });
  }
  return count;
}

function search() {
  const width = crisCross[0].length;
  const height = crisCross.length;
  var points: pointsType[] = [];
  const foundPoints: pointsType[][] = [];
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      if (crisCross[y][x] === "M") {
        foundPoints.push(searchDiagonal(x, y));
      }
    }
  }
  foundPoints
    .filter((points) => points.length > 0)
    .forEach((foundPoint) => {
      foundPoint.forEach((point) => {
        points.push(point);
      });
    });
  return countPerpendicular(points);
}

rl.on("close", () => {
  console.log("\n");
  const count = search();
  console.log(`Count of X-MAS: ${count}`);
});
