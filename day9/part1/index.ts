import { readFileSync } from "fs";

export default function main() {
  const input = readFileSync(process.env.INPUT_PATH!, "utf-8");
  let filesystem: string[] = [];

  function parseInput() {
    let ind = 0;
    input.split("").forEach((char, i) => {
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
  }

  // rl.on("line", (line) => {
  //   parseInput(line);
  // });

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

      const tmp = filesystem.pop();
      if (tmp === "" || tmp === undefined) continue;
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

  parseInput();
  rearange();

  const checkSum = checksum();
  console.log(checkSum);
  return 1;
}

main();
