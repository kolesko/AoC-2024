import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const operands = ["+", "*"];
const evaluate: { [key: string]: number[] }[] = [];

rl.on("line", (line) => {
  const [result, ...rest] = line.split(" ").map((e) => parseInt(e));
  evaluate.push({ [result]: rest });
});

function solve() {
  let sum = 0;
  evaluate.forEach((test) => {
    const result = Object.keys(test)[0];
    const numbers = test[result];
    let foundSolution = false;
    const maxLength = operands.length ** (numbers.length - 1);
    for (let i = 0; i < maxLength; i++) {
      const binary = (i >>> 0).toString(operands.length);
      const operandIndexes =
        binary.length !== numbers.length - 1
          ? new Array(numbers.length - 1 - binary.length).fill(0).join("") +
            binary
          : binary;
      if (foundSolution) break;
      const resultToMatch = numbers
        .slice(1, numbers.length)
        .reduce((res, c, j) => {
          const operand =
            operands[parseInt(operandIndexes[j]) % operands.length];
          res = eval(`${res} ${operand} ${c}`);
          return res;
        }, numbers[0]);
      if (resultToMatch === parseInt(result)) {
        foundSolution = true;
        break;
      }
    }
    if (foundSolution) {
      sum += parseInt(result);
    }
  });
  return sum;
}

function solveRecursive() {
  let sum = 0;
  evaluate.forEach((test, i) => {
    const result = parseInt(Object.keys(test)[0]);
    const numbers = test[result];

    if (recursive(numbers[0], 0, result, numbers)) {
      sum += result;
    }
  });
  return sum;
}

function recursive(
  currentResult: number,
  currentIndex: number,
  expectedResult: number,
  numbers: number[]
): boolean {
  if (currentIndex === numbers.length - 1) {
    return currentResult === expectedResult;
  }
  if (currentResult > expectedResult) {
    return false;
  }
  if (
    recursive(
      currentResult + numbers[currentIndex + 1],
      currentIndex + 1,
      expectedResult,
      numbers
    )
  ) {
    return true;
  }
  if (
    recursive(
      currentResult * numbers[currentIndex + 1],
      currentIndex + 1,
      expectedResult,
      numbers
    )
  ) {
    return true;
  }
  return false;
}

rl.on("close", () => {
  console.log("\n");
  const sum = solveRecursive();

  console.log(`Sum of all results: ${sum}`);
});
