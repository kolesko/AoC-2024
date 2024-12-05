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
  return rules.filter((rule) => rule.before === b && rule.after === a);
}

function checkPage(pages: PagesToPrint) {
  var ok = true;
  for (var i = 0; i < pages.length - 1; i++) {
    for (var j = i + 1; j < pages.length; j++) {
      ok = checkRules(pages[i], pages[j]).length === 0;
      if (!ok) {
        break;
      }
    }
    if (!ok) {
      break;
    }
  }
  return ok;
}

function findBrokenRules(pages: number[]) {
  const brokenRules: Rule[] = [];
  const returnObject = { page: pages, brokenRules };
  for (var i = 0; i < pages.length - 1; i++) {
    for (var j = i + 1; j < pages.length; j++) {
      const ind = returnObject.brokenRules.findIndex(
        (rule) => rule.before === pages[i] && rule.after === pages[j]
      );
      if (ind === -1) {
        returnObject.brokenRules.push(...checkRules(pages[i], pages[j]));
      }
    }
  }
  return returnObject;
}

function findCorruptedPagesByRuels() {
  const returnPages: PagesToPrint[] = [];
  pagesToPrint.forEach((pages) => {
    const returnObject = findBrokenRules(pages);
    if (returnObject.brokenRules.length !== 0) {
      returnPages.push(returnObject.page);
    }
  });
  return returnPages;
}

function fixPage(page: number[], rules: Rule[]) {
  var fixedPage = page.slice();
  for (var i = 0; i < rules.length; i++) {
    const rule = rules[i];
    fixedPage[fixedPage.indexOf(rule.before)] = rule.after;
    fixedPage[fixedPage.indexOf(rule.after)] = rule.before;
  }
  return fixedPage;
}

function fixCorruptedPages(pages: PagesToPrint[]) {
  const returnPages: PagesToPrint[] = [];
  pages.forEach((brokenPage) => {
    var page = brokenPage.slice();
    while (!checkPage(page)) {
      const brokenRules = findBrokenRules(page).brokenRules;
      page = fixPage(page, brokenRules);
    }
    returnPages.push(page);
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
  const corrupted = findCorruptedPagesByRuels();
  const fixed = fixCorruptedPages(corrupted);
  const sum = sumMiddleNumbers(fixed);
  console.log(`Sum of middle pages: ${sum}`);
});
