import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";
import { SortDescending } from "@utils/react";

export default function Day11() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });
  const digitRegex = /\d+/g;

  const day = 11;
  const data: string[] = api.file.getInputFile.useQuery({
    year: 2022,
    day: day,
  }).data;
  const exampleData: string[] = api.file.getInputFile.useQuery({
    year: 2022,
    day: day,
    example: true,
  }).data;

  interface Monkey {
    startingItems: number[];
    operation: string;
    value: string;
    test: Test;
  }

  interface Test {
    value: number;
    trueActionMonkey: number;
    falseActionMonkey: number;
  }

  const processData = (data: string[] | undefined) => {
    if (data) {
      const monkeys: Monkey[] = ProcessMonkeys(data);
      const monkeyInspectionsPart1: number[] = GetInspections(
        20,
        JSON.parse(JSON.stringify(monkeys)),
        false,
      );
      const monkeyInspectionsPart2: number[] = GetInspections(
        10_000,
        JSON.parse(JSON.stringify(monkeys)),
        true,
      );

      setParts({
        part1: getMonkeyBusiness(monkeyInspectionsPart1),
        part2: getMonkeyBusiness(monkeyInspectionsPart2),
      });
    }
  };

  return (
    <Puzzle
      handleGetResults={() => processData(data)}
      handleExampleGetResults={() => processData(exampleData)}
      day={day}
      results={parts}
    ></Puzzle>
  );

  function getMonkeyBusiness(inspections: number[]): number {
    return inspections[0] * inspections[1];
  }

  function GetInspections(
    maxRounds: number,
    monkeys: Monkey[],
    veryWorried: boolean,
  ): number[] {
    const monkeyInspections: number[] = Array<number>(monkeys.length).fill(0);
    const monkeyModulo: number = monkeys.reduce(
      (mod, monkeys) => mod * monkeys.test.value,
      1,
    );

    for (let round = 0; round < maxRounds; round++) {
      monkeys.forEach((monkey: Monkey) => {
        const monkeyIndex: number = monkeys.indexOf(monkey);
        monkey.startingItems.forEach((item) => {
          monkeyInspections[monkeyIndex]++;
          let worryLevel: number;
          let numValue = Number(monkey.value);
          if (isNaN(numValue)) {
            numValue = item;
          }
          if (monkey.operation == "*") {
            worryLevel = item * numValue;
          } else {
            worryLevel = item + numValue;
          }
          if (!veryWorried) {
            worryLevel = Math.floor(worryLevel / 3);
          }
          worryLevel = worryLevel % monkeyModulo;

          if (worryLevel % monkey.test.value == 0) {
            monkeys[monkey.test.trueActionMonkey].startingItems.push(
              worryLevel,
            );
          } else {
            monkeys[monkey.test.falseActionMonkey].startingItems.push(
              worryLevel,
            );
          }
        });
        monkey.startingItems = [];
      });
    }
    return SortDescending(monkeyInspections);
  }

  function ProcessMonkeys(data: string[]): Monkey[] {
    let currentMonkey: Monkey = null;
    const monkeys: Monkey[] = [];

    data.forEach((row) => {
      const splitRow: string[] = row.split(" ").filter((x) => x != "");
      if (splitRow[0] == "Monkey") {
        // reset the monkey
        currentMonkey = {
          startingItems: [],
          operation: "",
          value: null,
          test: {
            value: null,
            trueActionMonkey: null,
            falseActionMonkey: null,
          },
        };
      } else if (splitRow[0] == "Starting") {
        currentMonkey.startingItems = splitRow
          .slice(2, splitRow.length)
          .join("")
          .split(",")
          .map(Number);
      } else if (splitRow[0] == "Operation:") {
        const regex = /([*+]) (\d+|old)/g;
        const match: RegExpMatchArray[] = [...row.matchAll(regex)];
        currentMonkey.operation = match[0][1];
        currentMonkey.value = match[0][2];
      } else if (splitRow[0] == "Test:") {
        const match: RegExpMatchArray[] = [...row.matchAll(digitRegex)];
        currentMonkey.test.value = Number(match[0]);
      } else if (splitRow[1] == "true:") {
        const match: RegExpMatchArray[] = [...row.matchAll(digitRegex)];
        currentMonkey.test.trueActionMonkey = Number(match[0]);
      } else if (splitRow[1] == "false:") {
        const match: RegExpMatchArray[] = [...row.matchAll(digitRegex)];
        currentMonkey.test.falseActionMonkey = Number(match[0]);
        monkeys.push(currentMonkey);
      }
    });
    return monkeys;
  }
}
