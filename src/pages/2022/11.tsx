import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import { PartResults } from "~/classes/PuzzleResults";

export default function Day11() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });
  const digitRegex: RegExp = /\d+/g;

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
      let monkeyInspections = {};
      let monkeys: Monkey[] = ProcessMonkeys(data);

      console.log(monkeys);
      setParts({
        part1: 0,
        part2: 0,
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

  function ProcessMonkeys(data: string[]): Monkey[] {
    let currentMonkey: Monkey = null;
    let monkeys: Monkey[] = [];

    data.forEach((row) => {
      let splitRow = row.split(" ").filter((x) => x != "");
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
        let match = [...row.matchAll(regex)];
        currentMonkey.operation = match[0][1];
        currentMonkey.value = match[0][2];
      } else if (splitRow[0] == "Test:") {
        let match = [...row.matchAll(digitRegex)];
        currentMonkey.test.value = Number(match[0]);
      } else if (splitRow[1] == "true:") {
        let match = [...row.matchAll(digitRegex)];
        currentMonkey.test.trueActionMonkey = Number(match[0]);
      } else if (splitRow[1] == "false:") {
        let match = [...row.matchAll(digitRegex)];
        currentMonkey.test.falseActionMonkey = Number(match[0]);
        monkeys.push(currentMonkey);
      }
    });
    return monkeys;
  }
}
