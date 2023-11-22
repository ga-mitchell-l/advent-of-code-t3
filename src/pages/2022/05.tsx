import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import { PartResults } from "~/classes/PuzzleResults";

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
    let columnsRow = data.slice(crateIndex - 1, crateIndex)[0];

    if (columnsRow == undefined) {
      return 0;
    }

    let columns = columnsRow
      .split(" ")
      .filter((x) => x != "")
      .map(Number);
    return Math.max(...columns);
  };

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part1Count: number = 0;
      let part2Count: number = 0;

      const crateIndex = data.indexOf("");
      const crateDiagram = data.slice(0, crateIndex - 1).reverse();
      const moves = data.slice(crateIndex + 1, data.length);

      const numOfColumns = getNumOfColumns(crateIndex, data);
      let processedCrates = getProcessedCrates(numOfColumns, crateDiagram);
      let part2Crates = processedCrates.slice();
      console.log("starting crates");
      console.log(processedCrates);

      const regex = /\d+/g;
      moves.forEach((moveRow: string) => {
        console.log(moveRow);
        let match = [...moveRow.matchAll(regex)];

        const move = Number(match?.[0]);
        // zero based
        const from = Number(match?.[1]) - 1;
        const to = Number(match?.[2]) - 1;

        for (let i = 0; i < move; i++) {
          const removed = processedCrates[from].pop();
          processedCrates[to].push(removed);
        }

        console.log(processedCrates);
      });

      let part1 = "";
      // could do a reduce here but then I would have to type processedCrates properly
      processedCrates.forEach((column: Array<string>) => {
        part1 += column.at(-1);
      });

      setParts({
        part1: part1,
        part2: part2Count,
      });
    }
  };

  return (
    <Puzzle
      handleGetResults={() => {
        processData(data);
      }}
      day={day}
      results={parts}
    ></Puzzle>
  );

  function getProcessedCrates(numOfColumns: number, crateDiagram: string[]) {
    let processedCrates = new Array(numOfColumns);
    for (let i = 0; i < numOfColumns; i++) {
      processedCrates[i] = new Array<string>();
    }

    crateDiagram.forEach((crateRow: string) => {
      let columns = crateRow.split(" ");
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
          let crate = crateSpace.replace("[", "").replace("]", "");
          processedCrates[columnIndex]?.push(crate);
          columnIndex++;
        }
      });
    });
    return processedCrates;
  }
}
