import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day10() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 12;
  const data: string[] = api.file.getInputFile.useQuery({
    year: 2022,
    day: day,
  }).data;
  const exampleData: string[] = [
    "Sabqponm",
    "abcryxxl",
    "accszExk",
    "acctuvwj",
    "abdefghi",
  ];

  const processData = (data: string[] | undefined) => {
    const start = "S";
    const end = "E";

    if (data) {
      let { elevation, visited } = ProcessInput(data);

      console.log(elevation);
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

  function ProcessInput(data: string[]): processedData {
    let elevation: number[][] = [];
    let visited: boolean[][] = [];
    data.forEach((row) => {
      let elevationRow = row
        .replace("S", "a")
        .replace("E", "z")
        .split("")
        .map((x) => Number(x.charCodeAt(0)) - "a".charCodeAt(0));
      elevation.push(elevationRow);
      visited.push(Array<boolean>(elevationRow.length).fill(false));
    });
    return { elevation, visited };
  }

  interface processedData {
    elevation: number[][];
    visited: boolean[][];
  }
}
