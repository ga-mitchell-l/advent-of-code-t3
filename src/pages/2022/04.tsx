import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day04() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });
  const day = 4;

  const data = api.file.getInputFile.useQuery({ year: 2022, day: day }).data;
  const exampleData: string[] = [
    "2-4,6-8",
    "2-3,4-5",
    "5-7,7-9",
    "2-8,3-7",
    "6-6,4-6",
    "2-6,4-8",
  ];

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part1Count = 0;
      let part2Count = 0;
      data.forEach((row: string) => {
        let i = 0;
        const elfArray: number[][] = Array<Array<number>>(2);
        const elves: string[] = row.split(",");
        elves.forEach((elf: string) => {
          elfArray[i] = elf.split("-").map(Number);
          i += 1;
        });

        if (RangeContains(elfArray[0], elfArray[1])) {
          part1Count++;
        }

        if (RangeOverlaps(elfArray[0], elfArray[1])) {
          part2Count++;
        }
      });
      setParts({
        part1: part1Count,
        part2: part2Count,
      });
    }
  };

  const RangeContains = (rangeX: number[], rangeY: number[]) => {
    return (
      (rangeY[0] >= rangeX[0] && rangeY[1] <= rangeX[1]) ||
      (rangeX[0] >= rangeY[0] && rangeX[1] <= rangeY[1])
    );
  };

  const RangeOverlaps = (rangeX: number[], rangeY: number[]) => {
    return (
      (rangeX[0] <= rangeY[0] && rangeY[0] <= rangeX[1]) ||
      (rangeY[0] <= rangeX[0] && rangeX[0] <= rangeY[1])
    );
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
