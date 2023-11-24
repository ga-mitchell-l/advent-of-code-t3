import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import { PartResults } from "~/classes/PuzzleResults";

export default function Day05() {
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

  type Position = {
    i: number;
    j: number;
  };

  let hPosition = new Array<Position>();
  hPosition.push({ i: 0, j: 0 });
  let tPosition = new Array<Position>();
  tPosition.push({ i: 0, j: 0 });

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part2Count: number = 0;

      data.forEach((row: string) => {
        const [direction, distanceString] = row.split(" ");
        let distance = Number(distanceString);

        for (let d = 1; d <= distance; d++) {
          let lastHPosition = hPosition.slice()[hPosition.length - 1];
          let lastTPosition = tPosition.slice()[tPosition.length - 1];
          let nextHPosition = Object.assign({}, lastHPosition);
          let nextTPosition = Object.assign({}, lastTPosition);

          if (direction === "U") {
            nextHPosition.j++;
          } else if (direction == "D") {
            nextHPosition.j--;
          } else if (direction == "L") {
            nextHPosition.i--;
          } else if (direction == "R") {
            nextHPosition.i++;
          }

          // the tail always moves one step diagonally to keep up
          let iTheSame = nextHPosition.i === lastTPosition.i;
          let jTheSame = nextHPosition.j === lastTPosition.j;
          let iDiff = nextHPosition.i - lastTPosition.i;
          let jDiff = nextHPosition.j - lastTPosition.j;

          if (!iTheSame && !jTheSame) {
            if (Math.abs(jDiff) > 1 || Math.abs(iDiff) > 1) {
              // move diagonally
              nextTPosition.i += 1 * Math.sign(iDiff);
              nextTPosition.j += 1 * Math.sign(jDiff);
            }
          } else if (!iTheSame) {
            // moved horizontally
            if (Math.abs(iDiff) > 1) {
              nextTPosition.i += 1 * Math.sign(iDiff);
            }
          } else if (!jTheSame) {
            // moved vertically
            if (Math.abs(jDiff) > 1) {
              nextTPosition.j += 1 * Math.sign(jDiff);
            }
          }

          hPosition.push(nextHPosition);
          tPosition.push(nextTPosition);
        }
      });

      const stringTPosition = tPosition.map(function (value) {
        return value.i + "," + value.j;
      });

      let positionCount = new Set(stringTPosition).size;

      setParts({
        part1: positionCount,
        part2: part2Count,
      });
    }
  };

  return (
    <Puzzle
      handleGetResults={() => {
        processData(data);
      }}
      day={day}
      results={parts}
    ></Puzzle>
  );
}
