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
    ranges: RangeMap[];
  };

  type ReturnType = {
    seeds: number[];
    almanacMaps: AlmanacMap[];
    seedRanges: number[][];
  };

  type RangeMap = {
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
      let part2Source = results.seedRanges;
      // results.almanacMaps.forEach((map) => {
      //   source = MoveToDestination(source, map.ranges);
      // });
      for (let i = 0; i < results.almanacMaps.length; i++) {
        const map = results.almanacMaps[i];
        part2Source = RangeMoveToDestination(part2Source, map.ranges);
      }

      const minLocation = Math.min(...source);
      const part2Locations = part2Source.map((x) => x[0]);
      const minPart2Location = Math.min(...part2Locations);

      setParts({
        part1: minLocation,
        part2: minPart2Location,
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
    sources: number[],
    mapRanges: RangeMap[],
  ): number[] {
    const destinations: number[] = [];
    sources.forEach((source) => {
      const mapsInRange = mapRanges.filter(
        (range) =>
          range.souceRangeStart <= source && source <= range.sourceRangeEnd,
      );
      if (mapsInRange.length == 1) {
        const destination = mapsInRange[0].destinationDiff + source;
        destinations.push(destination);
      } else {
        destinations.push(source);
      }
    });
    return destinations;
  }

  function RangeMoveToDestination(
    sources: number[][],
    mapRanges: RangeMap[],
  ): number[][] {
    const destinations: number[][] = [];

    while (sources.length > 0) {
      const source = sources.pop();

      const start = source[0];
      const end = source[1];
      const mapsInRangeSource = mapRanges.filter(
        (range) =>
          range.souceRangeStart <= start && start <= range.sourceRangeEnd,
      );
      const mapsInRangeDestination = mapRanges.filter(
        (range) => range.souceRangeStart <= end && end <= range.sourceRangeEnd,
      );
      if (mapsInRangeSource.length == 0 && mapsInRangeDestination.length == 0) {
        // range is not included in any map
        // map to itself
        const destination: number[] = [start, end];
        destinations.push(destination);
      } else if (mapsInRangeSource.length == 1) {
        const map = mapsInRangeSource[0];
        if (end <= map.sourceRangeEnd) {
          // range is included in map totally
          const destination: number[] = [
            start + map.destinationDiff,
            end + map.destinationDiff,
          ];
          destinations.push(destination);
        } else {
          // split up the range and do it again
          const rangeLeft: number[] = [start, map.sourceRangeEnd];
          sources.push(rangeLeft);
          const rangeRight: number[] = [map.sourceRangeEnd + 1, end];
          sources.push(rangeRight);
        }
      } else if (mapsInRangeDestination.length == 1) {
        const map = mapsInRangeDestination[0];
        const rangeLeft: number[] = [start, map.souceRangeStart - 1];
        const rangeRight: number[] = [map.souceRangeStart, end];
        sources.push(rangeLeft);
        sources.push(rangeRight);
      }
    }

    return destinations;
  }

  function ProcessInput(data: string[]): ReturnType {
    let seeds: number[] = [];
    let seedRanges: number[][] = [];
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

          for (let i = 0; i < seeds.length; i += 2) {
            const range = [seeds[i], seeds[i] + seeds[i + 1] - 1];
            seedRanges.push(range);
          }
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

      const range: RangeMap = {
        souceRangeStart: sourceRangeStart,
        sourceRangeEnd: sourceRangeStart + rangeLength - 1,
        destinationDiff: -sourceRangeStart + destinationRangeStart,
      };

      currentAlmanacMap.ranges.push(range);
    });

    if (currentAlmanacMap.sourceCategory != "") {
      almanacMaps.push(currentAlmanacMap);
    }

    return { seeds: seeds, almanacMaps: almanacMaps, seedRanges: seedRanges };
  }
}
