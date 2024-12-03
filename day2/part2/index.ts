import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const inputLines: number[][] = [];

rl.on("line", (line) => {
  const lineNumbers = line.split(" ").map((n) => parseInt(n));
  inputLines.push(lineNumbers);
});

function isLineSafe(line: number[]): boolean {
  var betweenBounds = true;
  var onlyIncrease = true;
  var onlyDecrease = true;
  for (var i = 0; i < line.length - 1; i++) {
    const diff = line[i + 1] - line[i];
    if (diff > 0) {
      onlyDecrease = false;
    }
    if (diff < 0) {
      onlyIncrease = false;
    }
    if (!(Math.abs(diff) <= 3 && Math.abs(diff) > 0)) {
      betweenBounds = false;
    }
  }
  return betweenBounds && (onlyIncrease || onlyDecrease);
}

function checkRemovedIndex(line: number[], index: number): boolean {
  const newLine = line.slice();
  newLine.splice(index, 1);
  return isLineSafe(newLine);
}

function secondCheckLine(line: number[]): boolean {
  for (var i = 0; i < line.length; i++) {
    if (checkRemovedIndex(line, i)) return true;
  }

  return false;
}

rl.on("close", () => {
  const safeLines = inputLines
    .map((line) => {
      const firstCheck = isLineSafe(line);
      if (firstCheck) {
        return firstCheck;
      } else {
        const secondCheck = secondCheckLine(line);
        return secondCheck;
      }
    })
    .filter((safe) => safe === true);

  console.log("\n");
  console.log(`Number of safe lines: ${safeLines.length}`);
});
