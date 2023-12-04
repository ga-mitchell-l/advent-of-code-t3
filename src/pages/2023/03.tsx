import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day03() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 3;
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
    example: true,
  }).data;

  const symbolRegex = /[^0-9.]/g;
  const splitRegex = /[^0-9]/g;
  const regex = /\d+/g;

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part1 = 0;
      const validNumbers = new Set<number[]>();

      const schematic: string[][] = getSchematic(data);
      const symbolIndexes: number[][] = getSymbolIndexes(schematic);

      symbolIndexes.forEach((symbolIndex) => {
        const [rowIndex, columnIndex] = symbolIndex;
        console.log("----------------");
        console.log("SYMBOL: " + rowIndex + ", " + columnIndex);

        for (
          let adjRowIndex = rowIndex - 1;
          adjRowIndex < rowIndex + 2;
          adjRowIndex++
        ) {
          const maxLeft = columnIndex - 1 - 2;
          const maxRight = columnIndex + 1 + 3;
          const floop = data[adjRowIndex].substring(maxLeft, maxRight);
          console.log(floop);

          const matches = [...floop.matchAll(regex)];
          matches.forEach((match) => {
            const num = Number(match[0]);
            console.log(num);
            const startIndex = match.index;
            const endIndex = startIndex + match[0].length - 1;
            console.log(startIndex + "," + endIndex);

            if (
              startIndex == 4 ||
              startIndex == 3 ||
              endIndex == 3 ||
              endIndex == 2
            ) {
              validNumbers.add([num, adjRowIndex, maxLeft + startIndex]);
            }
          });
        }
      });

      const validArray = Array.from(validNumbers).map((x) => x[0]);

      part1 = validArray.reduce((a, b) => a + b, 0);

      console.log(validNumbers);

      setParts({
        part1: part1,
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

  function getSymbolIndexes(schematic: string[][]) {
    const symbolIndexes: number[][] = [];
    for (let rowIndex = 0; rowIndex < schematic.length; rowIndex++) {
      const row = schematic[rowIndex];
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const item = row[columnIndex];
        const match = [...item.matchAll(symbolRegex)];
        if (match.length > 0) {
          symbolIndexes.push([rowIndex, columnIndex]);
        }
      }
    }
    return symbolIndexes;
  }

  function getSchematic(data: string[]) {
    const schematic: string[][] = [];
    data.forEach((row) => {
      schematic.push(row.split(""));
    });
    return schematic;
  }
}
