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
      let maxRows = data.length;
      let maxColumns = data[0].length;
      let { elevation, visited, startPosition, endPosition } =
        ProcessInput(data);

      // BFS algorithum
      let Q: number[][] = [];
      visited[startPosition[0]][startPosition[1]] = true;
      Q.push([startPosition[0], startPosition[1], 0]);

      let part1: number;
      let endFound = false;
      while (Q.length > 0 && !endFound) {
        let current = Q.shift();
        let currentRow = current[0];
        let currentColumn = current[1];
        let currentValue = current[2];
        if (!current) break;

        // get all adjacent vertices
        directions.forEach((direction) => {
          let next = AddPositions(current, direction);
          let nextRow = next[0];
          let nextColumn = next[1];

          let isOffGrid = IsOffGrid(next, maxRows, maxColumns);
          if (!isOffGrid) {
            let isVisited = visited[nextRow][nextColumn];
            if (!isVisited) {
              let nextElevation = elevation[nextRow][nextColumn];
              let currentElevation = elevation[currentRow][currentColumn];

              let elevationDiff = nextElevation - currentElevation;
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
    let startColumnIndex = row.indexOf(startChar);
    let endColumnIndex = row.indexOf(endChar);

    if (startColumnIndex > -1) {
      startPosition = [rowIndex, startColumnIndex];
    }
    if (endColumnIndex > -1) {
      endPosition = [rowIndex, endColumnIndex];
    }
    return { startPosition, endPosition };
  }
}
