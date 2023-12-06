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
      const raceWinningWays: number[] = [];
      for (let race = 0; race < times.length; race++) {
        console.log("---- RACE ---");
        const raceTime = times[race];
        const raceDistance = distances[race];
        console.log("time: " + raceTime + " distance: " + raceDistance);
        const timesForMinDistance = QuadraticFormula(
          raceTime,
          raceDistance + 1,
        );
        const minimumChargeTime = Math.ceil(Math.min(...timesForMinDistance));
        const maxChargeTime = Math.floor(Math.max(...timesForMinDistance));

        console.log("min charge time: " + minimumChargeTime);
        console.log("max charge time: " + maxChargeTime);
        const numberOfWays = maxChargeTime - minimumChargeTime + 1;
        raceWinningWays.push(numberOfWays);

        // let winningChargingTimes: number[] = [];
        // for (
        //   let chargeTime = minimumChargeTime + 1;
        //   chargeTime < maxChargeTime;
        //   chargeTime++
        // ) {
        //   console.log(chargeTime);
        //   const myDistance =
        //   // console.log(negative);
        //   // console.log(positive);
        //   // if (negative > raceDistance) {
        //   //   winningChargingTimes.push(negative);
        //   // }

        //   // if (positive > raceDistance) {
        //   //   winningChargingTimes.push(positive);
        //   // }
        // }
        // console.log(winningChargingTimes);
      }
      console.log(raceWinningWays);
      const marginOfError = raceWinningWays.reduce((a, b) => a * b, 1);

      setParts({
        part1: marginOfError,
        part2: 0,
      });
    }
  };

  function QuadraticFormula(time: number, distance: number): number[] {
    const a = time ** 2;
    const b = 4 * distance;
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
