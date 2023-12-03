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

  const symbolRegex = /[*#+$%\-\@\/=]/g;

  const processData = (data: string[] | undefined) => {
    // data = ["467..114..", "...*......", "..35..633."];
    // data = ["467", ".*.", "..3"];
    let part1 = 0;
    const validNumbers: number[] = [];
    if (data) {
      const schematic: string[][] = [];
      data.forEach((row) => {
        const splitRow = row.split("");
        schematic.push(splitRow);
      });

      schematic.forEach((row) => {
        console.log("--------------");
        console.log("row: " + row);
        const rowIndex = schematic.indexOf(row);

        for (let chunkIndex = 0; chunkIndex < row.length; chunkIndex++) {
          console.log("- - - - - -");
          console.log("index: " + rowIndex + ", " + chunkIndex);
          let chunk = row[chunkIndex];
          let floop = "";
          console.log("chunk: " + chunk);
          const numberChunk = Number(chunk);
          if (!isNaN(numberChunk)) {
            for (
              let adjRowIndex = rowIndex - 1;
              adjRowIndex < rowIndex + 2;
              adjRowIndex++
            ) {
              if (adjRowIndex > -1 && adjRowIndex < schematic.length) {
                let adjRow = schematic[adjRowIndex];
                console.log(adjRow);

                for (
                  let adjChunkIndex = chunkIndex - 1;
                  adjChunkIndex < chunkIndex + 2;
                  adjChunkIndex++
                ) {
                  if (adjChunkIndex > -1 && adjChunkIndex < adjRow.length) {
                    let adjChunk = adjRow[adjChunkIndex];
                    floop = floop + adjChunk;
                  }
                }
              }
            }
            console.log("floop: " + floop);
            const match = [...floop.matchAll(symbolRegex)];
            if (match.length > 0) {
              console.log("it's a match: " + chunk);
              validNumbers.push(numberChunk);
              console.log(validNumbers);
            }
          }
        }

        part1 = validNumbers.reduce((p, q) => p + q, 0);
      });
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
}
