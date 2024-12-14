import { readFileSync } from "fs";
import LP from "lp_solve";

type Point = {
  x: number;
  y: number;
};

type Machine = {
  a: Point;
  b: Point;
  prize: Point;
};

const machines: Machine[] = [];

const input = readFileSync(process.env.INPUT_PATH!, "utf-8");

function parseInput() {
  const lines = input.split("\n");
  let machine: Machine = {
    a: { x: 0, y: 0 },
    b: { x: 0, y: 0 },
    prize: { x: 0, y: 0 },
  };
  const keys = ["a", "b", "prize"];
  let i = 0;
  for (const line of lines) {
    const match = /(?<x>\d+).{4}(?<y>\d+)/g.exec(line);
    if (match) {
      const key = keys[i % keys.length] as keyof Machine;
      const x = parseInt(match.groups?.x!);
      const y = parseInt(match.groups?.y!);
      machine[key] = { x, y };
      i++;
    } else {
      machines.push(machine);
      machine = {
        a: { x: 0, y: 0 },
        b: { x: 0, y: 0 },
        prize: { x: 0, y: 0 },
      };
    }
  }
  machines.push(machine);
}

// MIN 3 * A + B
// A * a.x + B * b.x = 8400
// A * a.y + B * b.y = 5400

function solve(machine: Machine) {
  const solver = new LP.LinearProgram();
  const Row = LP.Row;

  solver.setVerbose(0);

  const A = solver.addColumn("A", true);
  const B = solver.addColumn("B", true);

  solver.setObjective(new Row().Add(A, 3).Add(B, 1), true);

  const constraint1 = new Row().Add(A, machine.a.x).Add(B, machine.b.x);
  const constraint2 = new Row().Add(A, machine.a.y).Add(B, machine.b.y);

  solver.addConstraint(constraint1, "EQ", machine.prize.x + 10000000000000);
  solver.addConstraint(constraint2, "EQ", machine.prize.y + 10000000000000);

  solver.addConstraint(new Row().Add(A, 1), "GE", 0);
  // solver.addConstraint(new Row().Add(A, 1), "LE", 100);
  solver.addConstraint(new Row().Add(B, 1), "GE", 0);
  // solver.addConstraint(new Row().Add(B, 1), "LE", 100);

  const feasable = solver.solve().description === "OPTIMAL";
  const constraint1Res = solver.calculate(constraint1);
  const constraint2Res = solver.calculate(constraint2);
  if (
    !feasable ||
    constraint1Res !== machine.prize.x + 10000000000000 ||
    constraint2Res !== machine.prize.y + 10000000000000
  ) {
    return 0;
  }
  const res = Math.round(solver.getObjectiveValue());
  return res;
}

export default function main() {
  parseInput();

  let tokens = 0;

  machines.forEach((machine) => {
    const res = solve(machine);
    tokens += res;
  });
  console.log(`tokens: ${tokens}`);
}

main();
