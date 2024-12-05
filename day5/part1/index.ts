import process from "process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

type Rule = { before: number; after: number };
type PagesToPrint = number[];
const rules: Rule[] = [];
const pagesToPrint: PagesToPrint[] = [];
var hitBreak = false;

rl.on("line", (line) => {
  if (hitBreak) {
    const pages = line.split(",").map(Number);
    pagesToPrint.push(pages);
  }
  if (line === "") {
    hitBreak = true;
  }
  if (!hitBreak) {
    const [before, after] = line.split("|").map(Number);
    rules.push({ before, after });
  }
});

function checkRules(a: number, b: number) {
  return (
    rules.filter((rule) => rule.before === b && rule.after === a).length === 0
  );
}

function reducePagesByRuels() {
  const returnPages: PagesToPrint[] = [];
  pagesToPrint.forEach((pages) => {
    var ok = true;
    for (var i = 0; i < pages.length - 1; i++) {
      for (var j = i + 1; j < pages.length; j++) {
        ok = checkRules(pages[i], pages[j]);
        if (!print) {
          break;
        }
      }
      if (!ok) {
        break;
      }
    }
    if (ok) {
      returnPages.push(pages);
    }
  });
  return returnPages;
}

function sumMiddleNumbers(pages: PagesToPrint[]) {
  var sum = 0;
  pages.forEach((page) => {
    const length = page.length;
    sum += page[Math.floor(length / 2)];
  });
  return sum;
}

rl.on("close", () => {
  console.log("\n");
  const realPagesToPrint = reducePagesByRuels();
  const sum = sumMiddleNumbers(realPagesToPrint);
  console.log(`Sum of middle pages: ${sum}`);
});
