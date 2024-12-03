import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const left: number[] = [];
const right: number[] = [];
const similarity: Map<number, number> = new Map();

rl.on("line", (line) => {
  const [leftPart, rightPart] = line.split("   ");
  left.push(parseInt(leftPart));
  right.push(parseInt(rightPart));
});

function fillSimilarityMap(arr1: number[], arr2: number[]) {
  for (let i = 0; i < arr1.length; i++) {
    const countOfNumber = arr2.filter((num) => num === arr1[i]).length;
    const prevSimilarity = similarity.get(arr1[i]);
    if (prevSimilarity) {
      similarity.set(arr1[i], prevSimilarity + countOfNumber * arr1[i]);
    } else {
      similarity.set(arr1[i], countOfNumber * arr1[i]);
    }
  }
}

function getSumOfDistances(similarity: Map<number, number>) {
  let sum = 0;
  for (const [key, value] of similarity) {
    sum += value;
  }
  return sum;
}

rl.on("close", () => {
  console.log("\n");
  fillSimilarityMap(left, right);
  const distance = getSumOfDistances(similarity);

  console.log(`Distance between left and right: ${distance}`);
});
