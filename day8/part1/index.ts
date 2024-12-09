import { readFileSync } from "fs";

export default function main() {
  const input = readFileSync(process.env.INPUT_PATH!, "utf-8");
  var width = 0;
  var height = 0;

  var antenas: { [key: string]: { x: number; y: number }[] } = {};

  function parseInput() {
    input.split("\n").forEach((line) => {
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
  }

  function isInBounds(x: number, y: number) {
    return x >= 0 && x < width && y >= 0 && y < height;
  }
  function hasSameAntena(x: number, y: number, antena: string) {
    return antenas[antena].some(({ x: x1, y: y1 }) => {
      return x === x1 && y === y1;
    });
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

            const posibleAnti1 = { x: ant1.x + diff.x, y: ant1.y + diff.y };
            const posibleAnti2 = { x: ant2.x - diff.x, y: ant2.y - diff.y };

            if (
              isInBounds(posibleAnti1.x, posibleAnti1.y) &&
              !hasSameAntena(posibleAnti1.x, posibleAnti1.y, key)
            ) {
              anti.add(`${posibleAnti1.x},${posibleAnti1.y}`);
            }
            if (
              isInBounds(posibleAnti2.x, posibleAnti2.y) &&
              !hasSameAntena(posibleAnti2.x, posibleAnti2.y, key)
            ) {
              anti.add(`${posibleAnti2.x},${posibleAnti2.y}`);
            }
          }
        }
      }
    }
    return anti.size;
  }

  parseInput();
  const count = countAnti();
  console.log(`There are ${count} anti-antennas.`);
}

main();
