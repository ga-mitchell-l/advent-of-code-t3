import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day10() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const redMax = 12;
  const greenMax = 13;
  const blueMax = 14;

  const day = 10;
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

  const processData = (data: string[] | undefined) => {
    console.log("hello");
    console.log(data);
    if (data) {
      let idSum = 0;
      console.log(data);
      data.forEach((row) => {
        const [game, cubes] = row.split(": ");
        console.log("game: " + game);
        console.log("cubes: " + cubes);
      });
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
