import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import { PartResults } from "~/classes/PuzzleResults";

export default function Day10() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 10;
  const data: string[] = api.file.getInputFile.useQuery({
    year: 2022,
    day: day,
  }).data;
  const exampleData: string[] = api.file.getInputFile.useQuery({
    year: 2022,
    day: day,
    example: true,
  }).data;

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part1Count: number = 0;
      let part2Count: number = 0;

      data.forEach((row: string) => {});
      setParts({
        part1: part1Count,
        part2: part2Count,
      });
    }
  };

  return (
    <Puzzle
      handleGetResults={() => {
        processData(exampleData);
      }}
      day={day}
      results={parts}
    ></Puzzle>
  );
}
