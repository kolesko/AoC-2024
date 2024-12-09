import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let filesystem: string[] = [];

rl.on("line", (line) => {
  let ind = 0;
  line.split("").forEach((char, i) => {
    if (i % 2 === 0) {
      for (let j = 0; j < parseInt(char); j++) {
        filesystem.push(`${ind}`);
      }
      ind++;
    } else {
      for (let j = 0; j < parseInt(char); j++) {
        filesystem.push("");
      }
    }
  });
});

function haveSpace() {
  const lastInd = filesystem.findLastIndex((char) => char !== "");
  return filesystem.slice(0, lastInd).some((char) => char === "");
}

function findFirstEmpty() {
  return filesystem.findIndex((char) => char === "");
}

function rearange() {
  while (haveSpace()) {
    const firstEmptyInd = findFirstEmpty();
    const lastDigitInd = filesystem.findLastIndex((char) => char !== "");

    const tmp = filesystem[lastDigitInd];
    filesystem[lastDigitInd] = filesystem[firstEmptyInd];
    filesystem[firstEmptyInd] = tmp;
  }
}

function checksum() {
  return filesystem.reduce((acc, char, i) => {
    if (char === "") return acc;
    acc += parseInt(char) * i;
    return acc;
  }, 0);
}

rl.on("close", () => {
  console.log("\n");
  rearange();

  console.log(checksum());
});
