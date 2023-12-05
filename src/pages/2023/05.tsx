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
    destinationCategory: string;
    map: { [key: number]: number };
  };

  type ReturnType = {
    seeds: number[];
    almanacMaps: AlmanacMap[];
  };

  function GetEmptyAlmanacMap() {
    const map: AlmanacMap = {
      sourceCategory: "",
      destinationCategory: "",
      map: {},
    };
    return map;
  }

  function getRangeArray(start, length): number[] {
    return Array.from({ length: length }, (value, index) => start + index);
  }

  const processData = (data: string[] | undefined) => {
    if (data) {
      const results = ProcessInput(data);

      console.log(results.almanacMaps);
      console.log(results.seeds);
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

      for (let i = 0; i < sourceRange.length; i++) {
        currentAlmanacMap.map[sourceRange[i]] = destinationRange[i];
      }
    });

    return { seeds: seeds, almanacMaps: almanacMaps };
  }
}
