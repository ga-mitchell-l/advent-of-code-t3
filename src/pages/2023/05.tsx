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
    part1Seeds: number[][];
    almanacMaps: AlmanacMap[];
    part2Seeds: number[][];
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

      let part1Source = results.part1Seeds;
      let part2Source = results.part2Seeds;
      results.almanacMaps.forEach((map) => {
        part1Source = RangeMoveToDestination(part1Source, map.ranges);
        part2Source = RangeMoveToDestination(part2Source, map.ranges);
      });

      const part1Locations = part1Source.map((x) => x[0]);
      const minPart1Location = Math.min(...part1Locations);
      const part2Locations = part2Source.map((x) => x[0]);
      const minPart2Location = Math.min(...part2Locations);

      setParts({
        part1: minPart1Location,
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
        destinations.push(source);
      } else if (
        mapsInRangeSource.length == 1 &&
        mapsInRangeDestination.length == 1 &&
        mapsInRangeSource[0].souceRangeStart ==
          mapsInRangeDestination[0].souceRangeStart
      ) {
        // range is included in one map totally
        const map = mapsInRangeSource[0];
        if (end <= map.sourceRangeEnd) {
          const destination: number[] = [
            start + map.destinationDiff,
            end + map.destinationDiff,
          ];
          destinations.push(destination);
        }
      } else if (mapsInRangeSource.length == 1) {
        // start of range is included in a map
        // split up the range and process again
        const map = mapsInRangeSource[0];
        const rangeLeft: number[] = [start, map.sourceRangeEnd];
        const rangeRight: number[] = [map.sourceRangeEnd + 1, end];
        sources.push(rangeLeft);
        sources.push(rangeRight);
      } else if (mapsInRangeDestination.length == 1) {
        // end of range is included in a map
        // split up the range and process again
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
    let part1Seeds: number[][] = [];
    const part2Seeds: number[][] = [];
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
          const seeds = GetNumberArray(seedString);
          part1Seeds = seeds.map((x) => [x, x]);

          for (let i = 0; i < seeds.length; i += 2) {
            const range = [seeds[i], seeds[i] + seeds[i + 1] - 1];
            part2Seeds.push(range);
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

    return {
      part1Seeds: part1Seeds,
      almanacMaps: almanacMaps,
      part2Seeds: part2Seeds,
    };
  }
}
