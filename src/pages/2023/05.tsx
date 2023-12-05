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
    seedRanges: Range[];
  };

  type RangeMap = {
    souceRangeStart: number;
    sourceRangeEnd: number;
    destinationDiff: number;
  };

  type Range = {
    start: number;
    end: number;
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
      results.almanacMaps.forEach((map) => {
        source = MoveToDestination(source, map.ranges);
      });
      for (let i = 0; i < 2; i++) {
        console.log(" - - - MAP - - - -");
        const map = results.almanacMaps[i];
        part2Source = RangeMoveToDestination(part2Source, map.ranges);
        console.log(part2Source);
      }

      const minLocation = Math.min(...source);
      const part2Locations = part2Source.map((x) => x.start);
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
    sources: Range[],
    mapRanges: RangeMap[],
  ): Range[] {
    const destinations: Range[] = [];

    console.log("sources: ");
    console.log(sources);

    while (sources.length > 0) {
      console.log("-----------");
      const source = sources.pop();
      console.log("SOURCE");
      console.log(source);
      console.log("sources left: " + sources.length);

      const start = source.start;
      const end = source.end;
      const mapsInRangeSource = mapRanges.filter(
        (range) =>
          range.souceRangeStart <= start && start <= range.sourceRangeEnd,
      );
      const mapsInRangeDestination = mapRanges.filter(
        (range) => range.souceRangeStart <= end || end <= range.sourceRangeEnd,
      );
      if (mapsInRangeSource.length == 0 && mapsInRangeDestination.length == 0) {
        // range is not included in any map
        // map to itself
        console.log("range not included in map");
        const destination: Range = { start: start, end: end };
        destinations.push(destination);
        console.log(destinations);
      } else if (mapsInRangeSource.length == 1) {
        const map = mapsInRangeSource[0];
        console.log(map.sourceRangeEnd);
        if (end <= map.sourceRangeEnd) {
          console.log("range totally included in map");
          // range is included in map totally
          const destination: Range = {
            start: start + map.destinationDiff,
            end: end + map.destinationDiff,
          };
          destinations.push(destination);
          console.log(destinations);
        } else {
          console.log("range partially included in map");
          // split up the range and do it again
          const rangeLeft: Range = { start: start, end: map.sourceRangeEnd };
          sources.push(rangeLeft);
          const rangeRight: Range = { start: map.sourceRangeEnd + 1, end: end };
          sources.push(rangeRight);
          console.log("new number of sources: " + sources.length);
        }
      }
    }

    return destinations;
  }

  function ProcessInput(data: string[]): ReturnType {
    let seeds: number[] = [];
    let seedRanges: Range[] = [];
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
            const range: Range = {
              start: seeds[i],
              end: seeds[i] + seeds[i + 1] - 1,
            };
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

    console.log(seeds);
    console.log(seedRanges[0]);

    return { seeds: seeds, almanacMaps: almanacMaps, seedRanges: seedRanges };
  }
}
