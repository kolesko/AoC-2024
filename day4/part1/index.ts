import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const crisCross: string[][] = [];
const WORD_TO_SEARCH = "XMAS";

rl.on("line", (line) => {
  crisCross.push(line.split(""));
});

function searchDiagonal(positionX: number, positionY: number) {
  const width = crisCross[0].length;
  const height = crisCross.length;
  var foundTimes = 0;

  //SEARCH TOP RIGHT
  if (
    positionX <= width - WORD_TO_SEARCH.length &&
    positionY >= WORD_TO_SEARCH.length - 1
  ) {
    var indexInLetter = 1;
    var match = true;
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY - i][positionX + i] ===
        WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      foundTimes++;
      indexInLetter = 1;
    }
  }

  //SEARCH TOP LEFT
  if (
    positionX >= WORD_TO_SEARCH.length - 1 &&
    positionY >= WORD_TO_SEARCH.length - 1
  ) {
    var indexInLetter = 1;
    var match = true;
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY - i][positionX - i] ===
        WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      foundTimes++;
      indexInLetter = 1;
    }
  }

  //SEARCH BOTTOM RIGHT
  if (
    positionX <= width - WORD_TO_SEARCH.length &&
    positionY <= height - WORD_TO_SEARCH.length
  ) {
    var indexInLetter = 1;
    var match = true;
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY + i][positionX + i] ===
        WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      foundTimes++;
      indexInLetter = 1;
    }
  }

  //SEARCH BOTTOM LEFT
  if (
    positionX >= WORD_TO_SEARCH.length - 1 &&
    positionY <= height - WORD_TO_SEARCH.length
  ) {
    var indexInLetter = 1;
    var match = true;
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY + i][positionX - i] ===
        WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      foundTimes++;
      indexInLetter = 1;
    }
  }

  return foundTimes;
}

function searchHorizontal(positionX: number, positionY: number) {
  const width = crisCross[0].length;
  var foundTimes = 0;

  // SEARCH RIGHT
  if (positionX <= width - WORD_TO_SEARCH.length) {
    var indexInLetter = 1;
    var match = true;
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY][positionX + i] === WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      foundTimes++;
      indexInLetter = 1;
    }
  }

  // SEARCH LEFT
  if (positionX >= WORD_TO_SEARCH.length - 1) {
    var indexInLetter = 1;
    var match = true;
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY][positionX - i] === WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      foundTimes++;
      indexInLetter = 1;
    }
  }

  return foundTimes;
}

function searchVertical(positionX: number, positionY: number) {
  const height = crisCross.length;
  var foundTimes = 0;

  // SEARCH BOTTOM
  if (positionY <= height - WORD_TO_SEARCH.length) {
    var indexInLetter = 1;
    var match = true;
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY + i][positionX] === WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      foundTimes++;
      indexInLetter = 1;
    }
  }

  // SEARCH TOP
  if (positionY >= WORD_TO_SEARCH.length - 1) {
    var indexInLetter = 1;
    var match = true;
    for (var i = 1; i < WORD_TO_SEARCH.length; i++) {
      if (
        crisCross[positionY - i][positionX] === WORD_TO_SEARCH[indexInLetter]
      ) {
        indexInLetter++;
      } else {
        match = false;
        indexInLetter = 1;
      }
    }
    if (match) {
      foundTimes++;
      indexInLetter = 1;
    }
  }

  return foundTimes;
}

function search() {
  const width = crisCross[0].length;
  const height = crisCross.length;
  var foundSum = 0;
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      if (crisCross[y][x] === "X") {
        foundSum += searchHorizontal(x, y);
        foundSum += searchVertical(x, y);
        foundSum += searchDiagonal(x, y);
      }
    }
  }
  return foundSum;
}

rl.on("close", () => {
  console.log("\n");
  const count = search();
  console.log(`Count of XMAS: ${count}`);
});
