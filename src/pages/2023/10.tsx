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
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = [".....", ".S-7.", ".|.|.", ".L-J.", "....."];
  const nViable = ["|", "F", "7"];
  const eViable = ["-", "J", "7"];
  const sViable = ["|", "J", "L"];
  const wViable = ["-", "L", "F"];

  type direction = {
    index: [number, number];
    viableChars: string[];
    name: string;
  };

  const processData = (data: string[] | undefined) => {
    if (data) {
      let rowCount = data.length;
      let columnCount = data[0].length;

      var { start, pipes }: { start: [number, number]; pipes: string[][] } =
        getInputValues(data);

      replaceStartingPipe(start, pipes, rowCount, columnCount);

      // let currentPosition = start;
      // let startFound = false;
      // let stepCount = 0;
      // let previousPosition: [number, number];

      // while (startFound === false) {
      //   console.log("----------");
      //   console.log("current position: " + currentPosition);
      //   const v = pipes[currentPosition[0]][currentPosition[1]];
      //   console.log("value: " + v);

      //   const directions = getDirections(currentPosition);

      //   const viable = directions.map((d) =>
      //     isDirectionViable(d, pipes, rowCount, columnCount, previousPosition),
      //   );
      //   console.log(viable);

      //   let directionFound = false;
      //   let next: [number, number];
      //   let i = 0;
      //   while (directionFound === false) {
      //     directionFound = viable[i];
      //     next = directions[i].index;
      //     i++;
      //   }

      //   previousPosition = currentPosition;
      //   currentPosition = next;
      //   console.log("new position: " + currentPosition);

      //   startFound =
      //     currentPosition[0] === start[0] && currentPosition[1] === start[1];

      //   stepCount++;
      // }

      setParts({
        part1: 0,
        part2: 0,
      });
    }
  };

  const getStartingPipe = (directions: boolean[]): string => {
    const [n, e, s, w] = directions;
    if (n && s) {
      return "|";
    } else if (e && w) {
      return "-";
    } else if (n && e) {
      return "L";
    } else if (n && w) {
      return "J";
    } else if (s && w) {
      return "7";
    } else if (s && e) {
      return "F";
    } else {
      return ".";
    }
  };

  const isDirectionViable = (
    direction: direction,
    pipes: string[][],
    rowMax: number,
    columnMax: number,
    previousPosition: [number, number],
  ): boolean => {
    if (
      direction.index[0] < 0 ||
      direction.index[0] >= rowMax ||
      direction.index[1] < 0 ||
      direction.index[1] >= columnMax
    ) {
      return false;
    }

    if (
      previousPosition != undefined &&
      direction.index[0] == previousPosition[0] &&
      direction.index[1] == previousPosition[1]
    ) {
      return false;
    }

    const value = pipes[direction.index[0]][direction.index[1]];
    const viable = direction.viableChars.indexOf(value) > -1;

    return viable;
  };

  return (
    <Puzzle
      handleGetResults={() => processData(data)}
      handleExampleGetResults={() => processData(exampleData)}
      day={day}
      results={parts}
    ></Puzzle>
  );

  function replaceStartingPipe(
    start: [number, number],
    pipes: string[][],
    rowCount: number,
    columnCount: number,
  ) {
    const startDirections = getDirections(start);
    const viableDirections = startDirections.map((d) =>
      isDirectionViable(d, pipes, rowCount, columnCount, undefined),
    );

    const startingPipe = getStartingPipe(viableDirections);

    pipes[start[0]][start[1]] = startingPipe;
  }

  function getDirections(currentPosition: [number, number]): direction[] {
    const n: direction = {
      index: [currentPosition[0] - 1, currentPosition[1]],
      viableChars: nViable,
      name: "n",
    };
    const e: direction = {
      index: [currentPosition[0], currentPosition[1] + 1],
      viableChars: eViable,
      name: "e",
    };
    const s: direction = {
      index: [currentPosition[0] + 1, currentPosition[1]],
      viableChars: sViable,
      name: "s",
    };
    const w: direction = {
      index: [currentPosition[0], currentPosition[1] - 1],
      viableChars: wViable,
      name: "w",
    };
    const directions = [n, e, s, w];
    console.log(directions);
    return directions;
  }

  function getInputValues(data: string[]) {
    const pipes: string[][] = [];
    let start: [number, number];
    data.forEach((row) => {
      const rowIndex = data.indexOf(row);
      const splitRow = row.split("");
      pipes.push(splitRow);

      let columnIndex = splitRow.indexOf("S");
      if (columnIndex > -1) {
        start = [rowIndex, columnIndex];
      }
    });
    return { start, pipes };
  }
}
