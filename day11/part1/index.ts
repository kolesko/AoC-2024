import { readFileSync } from "fs";
const input = readFileSync(process.env.INPUT_PATH!, "utf-8");
let numbers: string[] = [];

function parseInput() {
  const split = input.split(" ");
  for (const number of split) {
    numbers.push(number);
  }
}

function blink(l: number) {
  const newNumbers = numbers.slice();
  let ind = 0;
  for (let i = 0; i < l; i++) {
    const number = numbers[i];
    if (number === "0") {
      newNumbers[ind] = "1";
      ind++;
    } else if (number.length % 2 === 0) {
      const half = Math.floor(number.length / 2);
      const left = parseInt(number.slice(0, half)).toString();
      const right = parseInt(number.slice(half)).toString();
      newNumbers.splice(ind, 1, left, right);
      ind += 2;
    } else {
      newNumbers[ind] = (parseInt(number) * 2024).toString();
      ind++;
    }
  }
  numbers = newNumbers;
}

export default function main() {
  parseInput();

  for (let i = 0; i < 25; i++) {
    blink(numbers.length);
  }
  console.log(`stones: ${numbers.length}`);
}

main();
