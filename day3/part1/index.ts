import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const regex = /(mul\(\d{1,3},\d{1,3}\))/g;
var input = "";

rl.on("line", (line) => {
  input += line;
});

function parseMul(mulStr: string) {
  const [, a, b] = mulStr.match(/mul\((\d{1,3}),(\d{1,3})\)/) ?? ["", "0", "0"];
  return [parseInt(a), parseInt(b)];
}

rl.on("close", () => {
  const resultGroups = input.match(regex);
  const sum = resultGroups?.reduce((acc, group) => {
    const [a, b] = parseMul(group);
    acc += a * b;
    return acc;
  }, 0);
  console.log("\n");
  console.log(`Sum: ${sum}`);
});
