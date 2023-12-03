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
  const splitRegex = /[*#+$%\-\@\/=\.]/g;

  const processData = (data: string[] | undefined) => {
    // data = ["467..114..", "...*......", "..35..633."];
    // data = ["467", ".*.", "..3"];
    let part1 = 0;
    const validNumbers: number[] = [];
    if (data) {
      data.forEach((row) => {
        console.log("_____________");
        console.log(row);
        const rowIndex = data.indexOf(row);
        const packets = row.split(splitRegex).filter((x) => x != "");
        console.log("PACKETS!!!");
        console.log(packets);
        packets.forEach((packet) => {
          console.log("- - - -");
          const numberPacket = Number(packet);
          if (!isNaN(numberPacket)) {
            const leftIndex = row.indexOf(packet);
            const rightIndex = leftIndex + packet.length - 1;
            console.log(leftIndex + "," + rightIndex);
            let adjChars = "";

            for (
              let adjRowIndex = rowIndex - 1;
              adjRowIndex < rowIndex + 2;
              adjRowIndex++
            ) {
              if (adjRowIndex > -1 && adjRowIndex < data.length) {
                let adjRow = data[adjRowIndex];
                console.log(adjRow);

                for (
                  let adjChunkIndex = leftIndex - 1;
                  adjChunkIndex < rightIndex + 2;
                  adjChunkIndex++
                ) {
                  if (adjChunkIndex > -1 && adjChunkIndex < adjRow.length) {
                    const adjChunk = adjRow[adjChunkIndex];
                    adjChars = adjChars + adjChunk;
                  }
                }
              }
            }
            console.log("adjchars: " + adjChars);
            const match = [...adjChars.matchAll(symbolRegex)];
            if (match.length > 0) {
              console.log("it's a match: " + numberPacket);
              validNumbers.push(numberPacket);
            }
          }
        });
      });

      console.log("valid numbers: " + validNumbers);
      part1 = validNumbers.reduce((p, q) => p + q, 0);
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
