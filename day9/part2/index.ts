import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let filesystem: string[] = [];
let freeSpace: string[] = [];

rl.on("line", (line) => {
  let ind = 0;
  let startIndex = 0;
  line.split("").forEach((char, i) => {
    let endIndex = startIndex;
    if (i % 2 === 0) {
      for (let j = 0; j < parseInt(char); j++) {
        filesystem.push(`${ind}`);
        endIndex++;
      }
      ind++;
    } else {
      for (let j = 0; j < parseInt(char); j++) {
        filesystem.push("");
        endIndex++;
      }
      if (startIndex !== endIndex) freeSpace.push(`${startIndex},${endIndex}`);
    }
    startIndex = endIndex;
  });
});

function getSizeOfLastFile(endIndex: number) {
  const startIndex = filesystem.findIndex(
    (char) => char === filesystem[endIndex]
  );
  return endIndex + 1 - startIndex;
}

function findEmptySpaceIndex(size: number, startIndex: number) {
  const ind = freeSpace.findIndex((space, i) => {
    const [start, end] = space.split(",").map((n) => parseInt(n));
    const sizeOfSpace = end - start;
    return sizeOfSpace >= size && start <= startIndex;
  });
  return ind;
}

function rearange() {
  let end = filesystem.length - 1;
  while (end >= 0) {
    if (filesystem[end] === "") {
      end--;
      continue;
    }
    const size = getSizeOfLastFile(end);

    const ind = findEmptySpaceIndex(size, end - size);

    if (ind === -1) {
      end -= size;
      continue;
    }

    const [sf, ef] = freeSpace[ind].split(",").map((n) => parseInt(n));
    for (let i = sf; i < size + sf; i++) {
      filesystem[i] = filesystem[end];
      filesystem[end] = "";
      end--;
    }

    if (sf + size !== ef) {
      freeSpace[ind] = `${sf + size},${ef}`;
    } else {
      freeSpace = freeSpace.filter((space, i) => i !== ind);
    }
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
