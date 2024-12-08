import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var width = 0;
var height = 0;

var antenas: { [key: string]: { x: number; y: number }[] } = {};

rl.on("line", (line) => {
  width = line.length;
  for (let i = 0; i < line.length; i++) {
    if (line[i] !== ".") {
      const exists = antenas[line[i]] ?? false;
      if (exists) {
        antenas[line[i]].push({ x: i, y: height });
      } else {
        antenas[line[i]] = [{ x: i, y: height }];
      }
    }
  }
  height += 1;
});

function isInBounds(x: number, y: number) {
  return x >= 0 && x < width && y >= 0 && y < height;
}

function countAnti() {
  const anti: Set<string> = new Set();

  for (const key in antenas) {
    if (antenas[key].length > 1) {
      for (let i = 0; i < antenas[key].length - 1; i++) {
        for (let j = i + 1; j < antenas[key].length; j++) {
          const ant1 = antenas[key][i];
          const ant2 = antenas[key][j];

          const diff = { x: ant1.x - ant2.x, y: ant1.y - ant2.y };

          let posibleAnti1 = { x: ant1.x, y: ant1.y };
          while (isInBounds(posibleAnti1.x, posibleAnti1.y)) {
            anti.add(`${posibleAnti1.x},${posibleAnti1.y}`);
            posibleAnti1.x += diff.x;
            posibleAnti1.y += diff.y;
          }

          let posibleAnti2 = { x: ant2.x, y: ant2.y };
          while (isInBounds(posibleAnti2.x, posibleAnti2.y)) {
            anti.add(`${posibleAnti2.x},${posibleAnti2.y}`);
            posibleAnti2.x -= diff.x;
            posibleAnti2.y -= diff.y;
          }
        }
      }
    }
  }
  return anti.size;
}

rl.on("close", () => {
  console.log("\n");
  const count = countAnti();
  console.log(`There are ${count} anti-antennas.`);
});
