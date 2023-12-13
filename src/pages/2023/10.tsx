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
  const exampleData2 = ["..F7.", ".FJ|.", "SJ.L7", "|F--J", "LJ..."];
  const exampleData3 = [
    "...........",
    ".S-------7.",
    ".|F-----7|.",
    ".||.....||.",
    ".||.....||.",
    ".|L-7.F-J|.",
    ".|..|.|..|.",
    ".L--J.L--J.",
    "...........",
  ];
  const directiontoPipeDict: { [key: string]: [string, string, string] } = {
    n: ["|", "F", "7"],
    e: ["-", "J", "7"],
    s: ["|", "J", "L"],
    w: ["-", "L", "F"],
  };
  const pipeToDirectionDict: { [key: string]: [string, string] } = {
    "|": ["n", "s"],
    "-": ["e", "w"],
    L: ["n", "e"],
    J: ["n", "w"],
    "7": ["s", "w"],
    F: ["s", "e"],
  };

  const d = ["n", "e", "s", "w"];

  type direction = {
    index: [number, number];
    name: string;
  };

  const processData = (data: string[] | undefined) => {
    if (data) {
      const rowCount = data.length;
      const columnCount = data[0].length;

      const { start, pipes }: { start: [number, number]; pipes: string[][] } =
        getInputValues(data);

      replaceStartingPipe(start, pipes, rowCount, columnCount);

      let currentPosition = start;
      let startFound = false;
      let stepCount = 0;
      let previousPosition: [number, number];
      let horriblyWrong = false;
      let leftCount = 0;
      let rightCount = 0;

      while (!startFound && !horriblyWrong) {
        console.log("-----");
        const currentValue = pipes[currentPosition[0]][currentPosition[1]];

        const directions = getDirections(currentPosition);
        const viable = directions.map((d) =>
          isDirectionViable(
            d,
            pipes,
            rowCount,
            columnCount,
            previousPosition,
            currentValue,
          ),
        );

        const viableIndex = viable.indexOf(true);
        const viableDirection = directions[viableIndex];
        const viableCount = viable.filter((x) => x).length;
        console.log("direction: " + d[viableIndex]);
        if (
          viableCount != 1 &&
          !(currentPosition[0] == start[0] && currentPosition[1] == start[1])
        ) {
          horriblyWrong = true;
          continue;
        }

        previousPosition = currentPosition;
        currentPosition = viableDirection.index;
        const [pipeLeftCount, pipeRightCount] = getCornerCount(
          currentPosition,
          viableIndex,
          pipes,
        );
        leftCount += pipeLeftCount;
        rightCount += pipeRightCount;

        if (pipeLeftCount) {
          console.log("LEFT");
        }
        if (pipeRightCount) {
          console.log("RIGHT");
        }

        startFound =
          currentPosition[0] === start[0] && currentPosition[1] === start[1];

        stepCount++;
      }

      console.log(" - - - - ");
      if (leftCount > rightCount) {
        console.log("anti clockwise");
      } else {
        console.log("clockwise ");
      }

      const maxDistance = stepCount / 2;

      setParts({
        part1: maxDistance,
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
    currentValue: string,
  ): boolean => {
    if (
      direction.index[0] < 0 ||
      direction.index[0] >= rowMax ||
      direction.index[1] < 0 ||
      direction.index[1] >= columnMax
    ) {
      // direction goes off the map of pipes
      return false;
    }

    if (
      previousPosition != undefined &&
      direction.index[0] == previousPosition[0] &&
      direction.index[1] == previousPosition[1]
    ) {
      // direction goes back where we were previously
      return false;
    }

    if (currentValue != "") {
      const pipeToDirections = pipeToDirectionDict[currentValue];
      const directionIndex = pipeToDirections.indexOf(direction.name);
      if (directionIndex < 0) {
        // direction is not valid from the pipe we are moving from
        return false;
      }
    }

    // the pipe at the direction makes sense to move to
    const value = pipes[direction.index[0]][direction.index[1]];
    const viable = directiontoPipeDict[direction.name].indexOf(value) > -1;

    return viable;
  };

  return (
    <Puzzle
      handleGetResults={() => processData(data)}
      handleExampleGetResults={() => processData(exampleData3)}
      day={day}
      results={parts}
    ></Puzzle>
  );

  function getCornerCount(
    currentPosition: [number, number],
    direction: Number,
    pipes: string[][],
  ): number[] {
    const pipe = pipes[currentPosition[0]][currentPosition[1]];
    console.log("pipe: " + pipe);
    if (pipe)
      switch (direction) {
        case 0:
          return [Number(pipe === "7"), Number(pipe === "F")];
        case 1:
          return [Number(pipe === "J"), Number(pipe === "7")];
        case 2:
          return [Number(pipe === "L"), Number(pipe === "J")];
        case 3:
          return [Number(pipe === "F"), Number(pipe === "L")];
        default:
          console.log("OH NO WE HAVE A CORNER PROBLEM");
          return [0, 0];
      }
  }

  function replaceStartingPipe(
    start: [number, number],
    pipes: string[][],
    rowCount: number,
    columnCount: number,
  ) {
    const startDirections = getDirections(start);
    const viableDirections = startDirections.map((d) =>
      isDirectionViable(d, pipes, rowCount, columnCount, undefined, ""),
    );

    const startingPipe = getStartingPipe(viableDirections);

    pipes[start[0]][start[1]] = startingPipe;
  }

  function getDirections(currentPosition: [number, number]): direction[] {
    const n: direction = {
      index: [currentPosition[0] - 1, currentPosition[1]],
      name: "n",
    };
    const e: direction = {
      index: [currentPosition[0], currentPosition[1] + 1],
      name: "e",
    };
    const s: direction = {
      index: [currentPosition[0] + 1, currentPosition[1]],
      name: "s",
    };
    const w: direction = {
      index: [currentPosition[0], currentPosition[1] - 1],
      name: "w",
    };
    const directions = [n, e, s, w];
    return directions;
  }

  function getInputValues(data: string[]) {
    const pipes: string[][] = [];
    let start: [number, number];
    data.forEach((row) => {
      const rowIndex = data.indexOf(row);
      const splitRow = row.split("");
      pipes.push(splitRow);

      const columnIndex = splitRow.indexOf("S");
      if (columnIndex > -1) {
        start = [rowIndex, columnIndex];
      }
    });
    return { start, pipes };
  }
}
