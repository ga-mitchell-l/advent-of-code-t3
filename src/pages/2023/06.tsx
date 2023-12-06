import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";
import { GetNumberArray } from "@utils/react";

export default function Day06() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 6;
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = [
    "Time:      7  15   30",
    "Distance:  9  40  200",
  ];

  const processData = (data: string[] | undefined) => {
    if (data) {
      const timeString = data[0].split(":")[1];
      const distanceString = data[1].split(":")[1];

      const times = GetNumberArray(timeString);
      const distances = GetNumberArray(distanceString);

      const marginOfError = part1(times, distances);
      const part2NumberOfWays = part2(times, distances);

      setParts({
        part1: marginOfError,
        part2: part2NumberOfWays,
      });
    }

    function part2(times: number[], distances: number[]) {
      const part2Time = Number(times.join(""));
      const part2Distance = Number(distances.join(""));
      const part2NumberOfWays = getNumberOfWaysToWin(part2Time, part2Distance);
      return part2NumberOfWays;
    }

    function part1(times: number[], distances: number[]) {
      const raceWinningWays: number[] = [];
      for (let race = 0; race < times.length; race++) {
        const raceTime = times[race];
        const raceDistance = distances[race];
        const numberOfWays = getNumberOfWaysToWin(raceTime, raceDistance);
        raceWinningWays.push(numberOfWays);
      }
      const marginOfError = raceWinningWays.reduce((a, b) => a * b, 1);
      return marginOfError;
    }
  };

  function getNumberOfWaysToWin(raceTime: number, raceDistance: number) {
    const timesForMinDistance = QuadraticFormula(raceTime, raceDistance + 1);
    const minimumChargeTime = Math.ceil(Math.min(...timesForMinDistance));
    const maxChargeTime = Math.floor(Math.max(...timesForMinDistance));

    const numberOfWays = maxChargeTime - minimumChargeTime + 1;
    return numberOfWays;
  }

  function QuadraticFormula(time: number, distance: number): number[] {
    const square = time * time + -(4 * distance);
    const squareRoot = Math.sqrt(square);
    const positive = (-time + squareRoot) / -2;
    const negative = (-time - squareRoot) / -2;
    return [positive, negative];
  }

  return (
    <Puzzle
      handleGetResults={() => processData(data)}
      handleExampleGetResults={() => processData(exampleData)}
      day={day}
      results={parts}
    ></Puzzle>
  );
}
