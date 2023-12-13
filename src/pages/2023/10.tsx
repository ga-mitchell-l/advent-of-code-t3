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
  const exampleData4 = [
    ".F----7F7F7F7F-7....",
    ".|F--7||||||||FJ....",
    ".||.FJ||||||||L7....",
    "FJL7L7LJLJ||LJ.L-7..",
    "L--J.L7...LJS7F-7L7.",
    "....F-J..F7FJ|L7L7L7",
    "....L7.F7||L7|.L7L7|",
    ".....|FJLJ|FJ|F7|.LJ",
    "....FJL-7.||.||||...",
    "....L---J.LJ.LJLJ...",
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

  type pipe = {
    index: [number, number];
    direction: number;
  };

  const processData = (data: string[] | undefined) => {
    if (data) {
      const rowCount = data.length;
      const columnCount = data[0].length;

      const { start, pipes }: { start: [number, number]; pipes: string[][] } =
        getInputValues(data);

      replaceStartingPipe(start, pipes, rowCount, columnCount);

      var {
        clockwise,
        pipeLoop,
        maxDistance,
      }: { clockwise: boolean; pipeLoop: pipe[]; maxDistance: number } =
        getMaxDistance(start, pipes, rowCount, columnCount);

      console.log("clockwise?: " + clockwise);
      console.log("pipeloop");
      console.log(pipeLoop);

      const innerPoints = new Set<string>();
      const pipeLoopStringIndexes = new Set(
        pipeLoop.map((pipe) => pipe.index[0] + "," + pipe.index[1]),
      );
      console.log(pipeLoopStringIndexes);

      pipeLoop.forEach((pipe) => {
        const pipeValue = pipes[pipe.index[0]][pipe.index[1]];
        console.log("pipevalue: " + pipeValue);
        console.log(d[pipe.direction]);
        if (pipeValue === "-") {
          let sign = 0;
          if (
            (pipe.direction == 1 && clockwise) ||
            (pipe.direction == 3 && !clockwise)
          ) {
            sign = 1;
          } else if (
            (pipe.direction == 3 && clockwise) ||
            (pipe.direction == 1 && !clockwise)
          ) {
            sign = -1;
          }

          let currentPipeRowIndex = pipe.index[0] + sign;
          let currentPipeIndex = currentPipeRowIndex + "," + pipe.index[1];
          while (!pipeLoopStringIndexes.has(currentPipeIndex)) {
            console.log("added to inner points: " + currentPipeIndex);
            innerPoints.add(currentPipeIndex);
            currentPipeRowIndex += sign;
            currentPipeIndex = currentPipeRowIndex + "," + pipe.index[1];
          }
        }

        if (pipeValue == "|") {
          let sign = 0;
          if (
            (pipe.direction == 0 && clockwise) ||
            (pipe.direction == 2 && !clockwise)
          ) {
            sign = 1;
          } else if (
            (pipe.direction == 2 && clockwise) ||
            (pipe.direction == 0 && !clockwise)
          ) {
            sign = -1;
          }

          let currentPipeColumnIndex = pipe.index[1] + sign;
          let currentPipeIndex = pipe.index[0] + "," + currentPipeColumnIndex;
          while (!pipeLoopStringIndexes.has(currentPipeIndex)) {
            console.log("added to inner points: " + currentPipeIndex);
            innerPoints.add(currentPipeIndex);
            currentPipeColumnIndex += sign;
            currentPipeIndex = pipe.index[0] + "," + currentPipeColumnIndex;
          }
        }
      });

      const innerPointCount = innerPoints.size;

      setParts({
        part1: maxDistance,
        part2: innerPointCount,
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
      handleExampleGetResults={() => processData(exampleData4)}
      day={day}
      results={parts}
    ></Puzzle>
  );

  function getMaxDistance(
    start: [number, number],
    pipes: string[][],
    rowCount: number,
    columnCount: number,
  ) {
    let currentPosition = start;
    let startFound = false;
    let stepCount = 0;
    let previousPosition: [number, number];
    let leftCount = 0;
    let rightCount = 0;
    let pipeLoop: pipe[] = [];

    while (!startFound) {
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

      const direction = viable.indexOf(true);
      const viableDirection = directions[direction];

      previousPosition = currentPosition;
      currentPosition = viableDirection.index;

      const currentPipe: pipe = {
        index: currentPosition,
        direction: direction,
      };
      pipeLoop.push(currentPipe);

      const [pipeLeftCount, pipeRightCount] = getCornerCount(
        currentPosition,
        direction,
        pipes,
      );
      leftCount += pipeLeftCount;
      rightCount += pipeRightCount;

      startFound =
        currentPosition[0] === start[0] && currentPosition[1] === start[1];

      stepCount++;
    }

    const clockwise = rightCount > leftCount;
    const maxDistance = stepCount / 2;
    return { clockwise, pipeLoop, maxDistance };
  }

  function getCornerCount(
    currentPosition: [number, number],
    direction: Number,
    pipes: string[][],
  ): number[] {
    const pipe = pipes[currentPosition[0]][currentPosition[1]];
    if (pipe)
      switch (direction) {
        case 0:
          // north
          return [Number(pipe === "7"), Number(pipe === "F")];
        case 1:
          // east
          return [Number(pipe === "J"), Number(pipe === "7")];
        case 2:
          // south
          return [Number(pipe === "L"), Number(pipe === "J")];
        case 3:
          // west
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
