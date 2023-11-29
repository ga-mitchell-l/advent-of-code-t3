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
  const startChar = "S";
  const endChar = "E";
  const directions = [
    [0, 1], // right
    [0, -1], // left
    [1, 0], // up
    [-1, 0], // down
  ];

  const processData = (data: string[] | undefined) => {
    if (data) {
      let { elevation, visited, startPosition, endPosition } =
        ProcessInput(data);

      console.log(startPosition);
      console.log(endPosition);
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
    let startPosition: number[];
    let endPosition: number[];

    data.forEach((row) => {
      ({ startPosition, endPosition } = getStartAndEndPositions(
        data,
        row,
        startPosition,
        endPosition,
      ));
      let elevationRow = row
        .replace(startChar, "a")
        .replace(endChar, "z")
        .split("")
        .map((x) => Number(x.charCodeAt(0)) - "a".charCodeAt(0));
      elevation.push(elevationRow);
      visited.push(Array<boolean>(elevationRow.length).fill(false));
    });
    return { elevation, visited, startPosition, endPosition };
  }

  interface processedData {
    elevation: number[][];
    visited: boolean[][];
    startPosition: number[];
    endPosition: number[];
  }

  function getStartAndEndPositions(
    data: string[],
    row: string,
    startPosition: number[],
    endPosition: number[],
  ) {
    let rowIndex = data.indexOf(row);
    let startIndex = row.indexOf(startChar);
    let endIndex = row.indexOf(endChar);

    if (startIndex > -1) {
      startPosition = [startIndex, rowIndex];
    }
    if (endIndex > -1) {
      endPosition = [endIndex, rowIndex];
    }
    return { startPosition, endPosition };
  }
}
