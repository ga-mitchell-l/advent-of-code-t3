import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day09() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 9;
  const data = api.file.getInputFile.useQuery({ year: 2022, day: day }).data;
  const exampleData: string[] = [
    "R 4",
    "U 4",
    "L 3",
    "D 1",
    "R 4",
    "D 1",
    "L 5",
    "R 2",
  ];
  const exampleData2: string[] = [
    "R 5",
    "U 8",
    "L 8",
    "D 3",
    "R 17",
    "D 10",
    "L 25",
    "U 20",
  ];

  type Position = {
    i: number;
    j: number;
  };

  const tPosition = new Array<Position>();
  tPosition.push({ i: 0, j: 0 });
  const ninthPosition = new Array<Position>();
  ninthPosition.push({ i: 0, j: 0 });

  const processData = (data: string[] | undefined) => {
    if (data) {
      const lastPositions = Array<Position>(10);
      for (let i = 0; i < lastPositions.length; i++) {
        lastPositions[i] = { i: 0, j: 0 };
      }

      data.forEach((row: string) => {
        const [direction, distanceString] = row.split(" ");
        const distance = Number(distanceString);

        for (let d = 1; d <= distance; d++) {
          lastPositions[0] = getNextHPosition(lastPositions[0], direction);
          for (let i = 1; i < lastPositions.length; i++) {
            lastPositions[i] = getNextTPosition(
              lastPositions[i],
              lastPositions[i - 1],
            );
          }

          tPosition.push(lastPositions[1]);
          ninthPosition.push(lastPositions[9]);
        }
      });

      const positionCount = getPositionCount(tPosition);
      const ninthPositionCount = getPositionCount(ninthPosition);

      setParts({
        part1: positionCount,
        part2: ninthPositionCount,
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

  function getPositionCount(tPosition: Position[]) {
    const stringTPosition = tPosition.map(function (value) {
      return value.i + "," + value.j;
    });
    const positionCount = new Set(stringTPosition).size;
    return positionCount;
  }

  function getNextHPosition(
    lastHPosition: { i: number; j: number },
    direction: string,
  ) {
    const nextHPosition = Object.assign({}, lastHPosition);

    if (direction === "U") {
      nextHPosition.j++;
    } else if (direction == "D") {
      nextHPosition.j--;
    } else if (direction == "L") {
      nextHPosition.i--;
    } else if (direction == "R") {
      nextHPosition.i++;
    }
    return nextHPosition;
  }

  function getNextTPosition(
    lastTPosition: { i: number; j: number },
    nextHPosition: { i: number; j: number },
  ) {
    const nextTPosition = Object.assign({}, lastTPosition);

    const iTheSame = nextHPosition.i === lastTPosition.i;
    const jTheSame = nextHPosition.j === lastTPosition.j;
    const iDiff = nextHPosition.i - lastTPosition.i;
    const jDiff = nextHPosition.j - lastTPosition.j;

    if (
      !iTheSame &&
      !jTheSame &&
      (Math.abs(jDiff) > 1 || Math.abs(iDiff) > 1)
    ) {
      // move diagonally
      nextTPosition.i += 1 * Math.sign(iDiff);
      nextTPosition.j += 1 * Math.sign(jDiff);
    } else if (!iTheSame && Math.abs(iDiff) > 1) {
      // moved horizontally
      nextTPosition.i += 1 * Math.sign(iDiff);
    } else if (!jTheSame && Math.abs(jDiff) > 1) {
      // moved vertically
      nextTPosition.j += 1 * Math.sign(jDiff);
    }
    return nextTPosition;
  }
}
