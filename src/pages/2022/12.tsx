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

  interface processedLocation {
    location: number[];
    value: number;
    char: string;
  }

  const processData = (data: string[] | undefined) => {
    if (data) {
      let {
        locationS,
        locationE,
      }: { locationS: number[]; locationE: number[] } =
        getStartingLocations(data);

      console.log("E: " + locationE);

      let currentLocation = [locationS[0], locationS[1]];
      let previousLocation: number[][] = [];
      let steps = 0;
      let eFound = false;
      const maxSteps = 4;

      while (
        locationS[0] != locationE[0] &&
        locationS[1] != locationE[1] &&
        steps < maxSteps &&
        eFound === false
      ) {
        console.log("current location: " + currentLocation);
        previousLocation.push([currentLocation[0], currentLocation[1]]);
        let currentElevation = data[currentLocation[1]][currentLocation[0]];
        if (currentElevation === "S") {
          currentElevation = "a";
        }

        const currentElevationValue = currentElevation.charCodeAt(0);
        console.log("current elevation: " + currentElevationValue);

        const potentialMoves = getPotentialMoves(currentLocation);

        // if any of these are E, choose that
        const eMoves = potentialMoves.filter(
          (x) => x[0] === locationE[0] && x[1] === locationE[1],
        );
        if (eMoves.length > 0) {
          eFound = true;
          return;
        }

        let filteredMoves = filterMoves(potentialMoves, previousLocation);

        // map them to the char values
        const viableValues = filteredMoves.map((move) => {
          let temp: processedLocation = {
            location: move,
            value: data[move[1]][move[0]].charCodeAt(0),
            char: data[move[1]][move[0]],
          };
          return temp;
        });

        // make sure we don't have to get out our climbing gear
        const nonClimbingValues = viableValues.filter(
          (x) => x.value <= currentElevationValue + 1,
        );

        // order by elevation
        const sortedNonClimbingValues = nonClimbingValues
          .sort(function (a, b) {
            return a.value - b.value;
          })
          .reverse();

        console.log("possible moves");
        console.log(sortedNonClimbingValues);

        // if there are only options that decrease in elevation, take the highest
        if (sortedNonClimbingValues[0].value < currentElevationValue) {
          currentLocation = [
            sortedNonClimbingValues[0].location[0],
            sortedNonClimbingValues[0].location[1],
          ];
        } else {
          const maxElevation = Math.max(
            ...sortedNonClimbingValues.map((loc) => {
              return loc.value;
            }),
          );

          const maxLocations = sortedNonClimbingValues.filter(
            (x) => x.value == maxElevation,
          );

          if (maxLocations.length === 1) {
            // if there is only one location that is possible, take that one
            currentLocation = [
              maxLocations[0].location[0],
              maxLocations[0].location[1],
            ];
          } else {
            console.log("- - - - OH NO!!! - - - -");
            let currentHDistance = Math.abs(currentLocation[0] - locationE[0]);
            let currentVDistance = Math.abs(currentLocation[1] - locationE[1]);

            if (currentHDistance > currentVDistance) {
              // prioritise moving horizontally
              console.log("moving horizontally");
              const sortH = maxLocations
                .sort(function (a, b) {
                  return (
                    Math.abs(locationE[0] - a.location[0]) -
                    Math.abs(locationE[0] - b.location[0])
                  );
                })
                .reverse();
              currentLocation = [sortH[0].location[0], sortH[0].location[1]];
            } else {
              // prioritise moving vertically
              console.log("moving vertically");
              const sortV = maxLocations
                .sort(function (a, b) {
                  return (
                    Math.abs(locationE[1] - a.location[1]) -
                    Math.abs(locationE[1] - b.location[1])
                  );
                })
                .reverse();

              currentLocation = [sortV[0].location[0], sortV[0].location[1]];
            }
          }
        }
        steps++;
        console.log("_______________");
      }
      setParts({
        part1: steps,
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

  function filterMoves(
    potentialMoves: number[][],
    previousLocation: number[][],
  ) {
    let viableMoves = potentialMoves.filter((x) => x[0] > -1 && x[1] > -1);

    // don't go back to your any last positions to prevent going in circles
    for (let i = 0; i < viableMoves.length; i++) {
      let match = previousLocation.filter(
        (x) => viableMoves[i][0] == x[0] && viableMoves[i][1] == x[1],
      );
      if (match.length > 0) {
        viableMoves.splice(i, 1);
      }
    }
    return viableMoves;
  }

  function getPotentialMoves(currentLocation: number[]) {
    return [
      [currentLocation[0] + 1, currentLocation[1]],
      [currentLocation[0] - 1, currentLocation[1]],
      [currentLocation[0], currentLocation[1] + 1],
      [currentLocation[0], currentLocation[1] - 1],
    ];
  }

  function getStartingLocations(data: string[]) {
    let locationS: number[];
    let locationE: number[];
    data.forEach((row) => {
      const rowIndex = data.indexOf(row);
      const sjIndex = row.indexOf("S");
      const eJIndex = row.indexOf("E");

      if (sjIndex > -1) {
        locationS = [sjIndex, rowIndex];
      }
      if (eJIndex > -1) {
        locationE = [eJIndex, rowIndex];
      }
    });
    return { locationS, locationE };
  }
}
