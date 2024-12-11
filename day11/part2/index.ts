import { readFileSync } from "fs";
const input = readFileSync(process.env.INPUT_PATH!, "utf-8");
const numbers: string[] = [];
const stepsMap = new Map<string, number>();

function parseInput() {
  const split = input.split(" ");
  for (const number of split) {
    numbers.push(number);
  }
}
function countSteps(number: number, step: number) {
  if (step === 0) {
    return 1;
  }
  if (!stepsMap.has(`${number},${step}`)) {
    let result = 0;
    if (number === 0) {
      result = countSteps(1, step - 1);
    } else if (number.toString().length % 2 === 0) {
      const strNum = number.toString();
      const half = Math.floor(strNum.length / 2);
      const left = parseInt(strNum.slice(0, half));
      const right = parseInt(strNum.slice(half));
      result += countSteps(left, step - 1);
      result += countSteps(right, step - 1);
    } else {
      result = countSteps(number * 2024, step - 1);
    }

    stepsMap.set(`${number},${step}`, result);
  }
  return stepsMap.get(`${number},${step}`)!;
}

export default function main() {
  parseInput();

  let steps = 0;
  for (let i = 0; i < numbers.length; i++) {
    const number = parseInt(numbers[i]);
    steps += countSteps(number, 75);
  }
  console.log(`stones: ${steps}`);
}

main();
