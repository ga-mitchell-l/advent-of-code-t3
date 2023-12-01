import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day10() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 10;
  const data: string[] = api.file.getInputFile.useQuery({
    year: 2023,
    day: day,
  }).data;
  const exampleData: string[] = api.file.getInputFile.useQuery({
    year: 2022,
    day: day,
    example: true,
  }).data;

  const processData = (data: string[] | undefined) => {
    if (data) {
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
}
