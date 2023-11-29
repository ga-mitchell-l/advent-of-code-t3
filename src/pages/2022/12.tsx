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
      const maxRows = data.length;
      const maxColumns = data[0].length;
      const { elevation, visited, startPosition, endPosition } =
        ProcessInput(data);

      let part1: number;
      // BFS algorithum
      part1 = BFSAlgorithum(
        JSON.parse(JSON.stringify(visited)),
        startPosition,
        maxRows,
        maxColumns,
        elevation,
        endPosition,
        part1,
      );

      // part 2
      const startingPositions: number[][] = getPositionsWithElevation(
        elevation,
        0,
      );

      const results: number[] = [];
      startingPositions.forEach((startPosition) => {
        const result = BFSAlgorithum(
          JSON.parse(JSON.stringify(visited)),
          startPosition,
          maxRows,
          maxColumns,
          elevation,
          endPosition,
          part1,
        );

        results.push(result);
      });

      const part2 = Math.min(...results);

      setParts({
        part1: part1,
        part2: part2,
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

  function getPositionsWithElevation(
    elevation: number[][],
    matchingElevation: number,
  ) {
    const startingPositions: number[][] = [];
    elevation.forEach((row) => {
      const rowIndex = elevation.indexOf(row);
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        if (row[columnIndex] == matchingElevation) {
          const position = [rowIndex, columnIndex];
          startingPositions.push(position);
        }
      }
    });
    return startingPositions;
  }

  function BFSAlgorithum(
    visited: boolean[][],
    startPosition: number[],
    maxRows: number,
    maxColumns: number,
    elevation: number[][],
    endPosition: number[],
    part1: number,
  ) {
    const Q: number[][] = [];
    visited[startPosition[0]][startPosition[1]] = true;
    Q.push([startPosition[0], startPosition[1], 0]);

    let endFound = false;
    while (Q.length > 0 && !endFound) {
      const current = Q.shift();
      const currentRow = current[0];
      const currentColumn = current[1];
      const currentValue = current[2];
      if (!current) break;

      // get all adjacent vertices
      directions.forEach((direction) => {
        const next = AddPositions(current, direction);
        const nextRow = next[0];
        const nextColumn = next[1];

        const isOffGrid = IsOffGrid(next, maxRows, maxColumns);
        if (!isOffGrid) {
          const isVisited = visited[nextRow][nextColumn];
          if (!isVisited) {
            const nextElevation = elevation[nextRow][nextColumn];
            const currentElevation = elevation[currentRow][currentColumn];

            const elevationDiff = nextElevation - currentElevation;
            if (elevationDiff <= 1) {
              // no climbing
              if (nextRow == endPosition[0] && nextColumn == endPosition[1]) {
                // end point
                endFound = true;
                part1 = currentValue + 1;
              } else {
                visited[nextRow][nextColumn] = true;
                Q.push([nextRow, nextColumn, currentValue + 1]);
              }
            }
          }
        }
      });
    }
    return part1;
  }

  function IsOffGrid(position: number[], maxRows: number, maxColumns: number) {
    return (
      position[0] < 0 ||
      position[1] < 0 ||
      position[0] >= maxRows ||
      position[1] >= maxColumns
    );
  }

  function AddPositions(a: number[], b: number[]) {
    return [a[0] + b[0], a[1] + b[1]];
  }

  function ProcessInput(data: string[]): processedData {
    const elevation: number[][] = [];
    const visited: boolean[][] = [];
    let startPosition: number[];
    let endPosition: number[];

    data.forEach((row) => {
      ({ startPosition, endPosition } = getStartAndEndPositions(
        data,
        row,
        startPosition,
        endPosition,
      ));
      const elevationRow = row
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
    const rowIndex = data.indexOf(row);
    const startColumnIndex = row.indexOf(startChar);
    const endColumnIndex = row.indexOf(endChar);

    if (startColumnIndex > -1) {
      startPosition = [rowIndex, startColumnIndex];
    }
    if (endColumnIndex > -1) {
      endPosition = [rowIndex, endColumnIndex];
    }
    return { startPosition, endPosition };
  }
}
