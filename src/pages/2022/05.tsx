import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";
import { GetNumberArray } from "@utils/react";

export default function Day05() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 5;
  const data = api.file.getInputFile.useQuery({ year: 2022, day: day }).data;

  const exampleData: string[] = [
    "    [D]    ",
    "[N] [C]    ",
    "[Z] [M] [P]",
    " 1   2   3 ",
    "",
    "move 1 from 2 to 1",
    "move 3 from 1 to 3",
    "move 2 from 2 to 1",
    "move 1 from 1 to 2",
  ];

  const getNumOfColumns = (crateIndex: number, data: string[]): number => {
    const columnsRow = data.slice(crateIndex - 1, crateIndex)[0];

    if (columnsRow == undefined) {
      return 0;
    }

    const columns = GetNumberArray(columnsRow);
    return Math.max(...columns);
  };

  const processData = (data: string[] | undefined) => {
    if (data) {
      const crateIndex = data.indexOf("");
      const crateDiagram = data.slice(0, crateIndex - 1).reverse();
      const moves = data.slice(crateIndex + 1, data.length);

      const numOfColumns = getNumOfColumns(crateIndex, data);
      const processedCrates = getProcessedCrates(numOfColumns, crateDiagram);
      const part2Crates = processedCrates.map(function (arr) {
        return arr.slice();
      });

      const regex = /\d+/g;
      moves.forEach((moveRow: string) => {
        const match = [...moveRow.matchAll(regex)];

        const move = Number(match?.[0]);
        // zero based
        const from = Number(match?.[1]) - 1;
        const to = Number(match?.[2]) - 1;

        // part 1
        for (let i = 0; i < move; i++) {
          const removed = processedCrates[from].pop();
          processedCrates[to].push(removed);
        }

        // part 2
        const stackFrom: string[] = part2Crates[from];
        const part2removed: string[] = stackFrom.splice(
          stackFrom.length - move,
          move,
        );
        const stackTo: string[] = part2Crates[to];
        stackTo.splice(stackTo.length, 0, ...part2removed);
      });

      setParts({
        part1: getCrateOutput(processedCrates),
        part2: getCrateOutput(part2Crates),
      });
    }
  };

  const getCrateOutput = (crates: string[][]): string => {
    // could do a reduce here but then I would have to type processedCrates properly
    let result = "";
    crates.forEach((column: Array<string>) => {
      result += column.at(-1);
    });

    return result;
  };

  return (
    <Puzzle
      handleGetResults={() => processData(data)}
      handleExampleGetResults={() => processData(exampleData)}
      day={day}
      results={parts}
    ></Puzzle>
  );

  function getProcessedCrates(numOfColumns: number, crateDiagram: string[]) {
    const processedCrates = new Array<Array<string>>(numOfColumns);
    for (let i = 0; i < numOfColumns; i++) {
      processedCrates[i] = new Array<string>();
    }

    crateDiagram.forEach((crateRow: string) => {
      const columns = crateRow.split(" ");
      let emptySpaceCount = 0; // 4 empty spaces mean one crate slot
      let columnIndex = 0;

      columns.forEach((crateSpace: string) => {
        if (crateSpace == "") {
          emptySpaceCount++;
          if (emptySpaceCount == 4) {
            columnIndex++;
            emptySpaceCount = 0;
          }
        } else {
          const crate = crateSpace.replace("[", "").replace("]", "");
          processedCrates[columnIndex]?.push(crate);
          columnIndex++;
        }
      });
    });
    return processedCrates;
  }
}
