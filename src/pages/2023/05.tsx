import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";
import { GetNumberArray } from "@utils/react";

export default function Day05() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 5;
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
    example: true,
  }).data;

  type AlmanacMap = {
    sourceCategory: string;
    ranges: Range[];
  };

  type ReturnType = {
    seeds: number[];
    almanacMaps: AlmanacMap[];
  };

  type Range = {
    souceRangeStart: number;
    sourceRangeEnd: number;
    destinationDiff: number;
  };

  function GetEmptyAlmanacMap() {
    const map: AlmanacMap = {
      sourceCategory: "",
      ranges: [],
    };
    return map;
  }

  const processData = (data: string[] | undefined) => {
    if (data) {
      const results = ProcessInput(data);

      let source = results.seeds;
      results.almanacMaps.forEach((map) => {
        source = MoveToDestination(source, map.ranges);
      });

      console.log(results.almanacMaps);
      console.log("seeds: " + results.seeds);
      console.log("locations: " + source);

      const minLocation = Math.min(...source);

      setParts({
        part1: minLocation,
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

  function MoveToDestination(seeds: number[], mapRanges: Range[]): number[] {
    const soils: number[] = [];
    seeds.forEach((seed) => {
      const mapsInRange = mapRanges.filter(
        (range) =>
          range.souceRangeStart <= seed && seed <= range.sourceRangeEnd,
      );
      if (mapsInRange.length == 1) {
        const destination = mapsInRange[0].destinationDiff + seed;
        soils.push(destination);
      } else {
        soils.push(seed);
      }
    });
    return soils;
  }

  function ProcessInput(data: string[]): ReturnType {
    let seeds: number[] = [];
    const almanacMaps: AlmanacMap[] = [];
    let currentAlmanacMap = GetEmptyAlmanacMap();

    data.forEach((row) => {
      // process empty row
      if (row == "") {
        if (currentAlmanacMap.sourceCategory != "") {
          almanacMaps.push(currentAlmanacMap);
        }
        currentAlmanacMap = GetEmptyAlmanacMap();
        return;
      }

      // process header rows
      const colonSplit = row.split(":");
      if (colonSplit.length > 1) {
        const heading = colonSplit[0];
        if (heading == "seeds") {
          const seedString = colonSplit[1];
          seeds = GetNumberArray(seedString);
          return;
        }

        const currentSection = heading.split(" ")[0];
        const source = currentSection.split("-")[0];
        currentAlmanacMap.sourceCategory = source;

        return;
      }

      // process map rows
      const [destinationRangeStart, sourceRangeStart, rangeLength] =
        GetNumberArray(row);

      const range: Range = {
        souceRangeStart: sourceRangeStart,
        sourceRangeEnd: sourceRangeStart + rangeLength - 1,
        destinationDiff: -sourceRangeStart + destinationRangeStart,
      };

      currentAlmanacMap.ranges.push(range);
    });

    if (currentAlmanacMap.sourceCategory != "") {
      almanacMaps.push(currentAlmanacMap);
    }

    return { seeds: seeds, almanacMaps: almanacMaps };
  }
}
