import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const left: number[] = [];
const right: number[] = [];

rl.on("line", (line) => {
  const [leftPart, rightPart] = line.split("   ");
  left.push(parseInt(leftPart));
  right.push(parseInt(rightPart));
});

function getSortedArray(arr: number[]) {
  const sortedArray = arr.sort((a, b) => a - b);
  return sortedArray;
}

function getSumOfDistances(arr1: number[], arr2: number[]) {
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    sum += Math.abs(arr1[i] - arr2[i]);
  }
  return sum;
}

rl.on("close", () => {
  console.log("\n");
  const sortedLeft = getSortedArray(left);
  const sortedRight = getSortedArray(right);
  const distance = getSumOfDistances(sortedLeft, sortedRight);

  console.log(`Distance between left and right: ${distance}`);
});
