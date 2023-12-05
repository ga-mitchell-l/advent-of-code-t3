import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";
import { GetNumberArray } from "@utils/react";
import { number } from "zod";

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
    destinationCategory: string;
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
      destinationCategory: "",
      ranges: [],
    };
    return map;
  }

  function getRangeArray(start, length): number[] {
    return Array.from({ length: length }, (value, index) => start + index);
  }

  const processData = (data: string[] | undefined) => {
    if (data) {
      const results = ProcessInput(data);

      const seedToSoilMap = results.almanacMaps.filter(
        (x) => x.sourceCategory == "seed",
      )[0];
      const soils: number[] = MoveToDestination(results, seedToSoilMap);

      console.log(results.almanacMaps);
      console.log("seeds: " + results.seeds);
      console.log("soils: " + soils);

      setParts({
        part1: 0,
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

  function MoveToDestination(
    results: {
      seeds: number[];
      almanacMaps: {
        sourceCategory: string;
        destinationCategory: string;
        ranges: {
          souceRangeStart: number;
          sourceRangeEnd: number;
          destinationDiff: number;
        }[];
      }[];
    },
    seedToSoilMap: {
      sourceCategory: string;
      destinationCategory: string;
      ranges: {
        souceRangeStart: number;
        sourceRangeEnd: number;
        destinationDiff: number;
      }[];
    },
  ) {
    const soils: number[] = [];
    results.seeds.forEach((seed) => {
      console.log("--- SEEDS ---");
      console.log(seed);
      const mapsInRange = seedToSoilMap.ranges.filter(
        (range) =>
          range.souceRangeStart <= seed && seed <= range.sourceRangeEnd,
      );
      console.log(mapsInRange);
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
        const [source, _, destination] = currentSection.split("-");
        currentAlmanacMap.sourceCategory = source;
        currentAlmanacMap.destinationCategory = destination;

        return;
      }

      // process map rows
      const [destinationRangeStart, sourceRangeStart, rangeLength] =
        GetNumberArray(row);

      const sourceRange = getRangeArray(sourceRangeStart, rangeLength);
      const destinationRange = getRangeArray(
        destinationRangeStart,
        rangeLength,
      );

      const range: Range = {
        souceRangeStart: sourceRangeStart,
        sourceRangeEnd: sourceRangeStart + rangeLength - 1,
        destinationDiff: -sourceRangeStart + destinationRangeStart,
      };

      currentAlmanacMap.ranges.push(range);
    });

    return { seeds: seeds, almanacMaps: almanacMaps };
  }
}
