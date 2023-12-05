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
    sourceRange: number[];
    destinationRange: number[];
  };

  function GetEmptyAlmanacMap() {
    const map: AlmanacMap = {
      sourceCategory: "",
      destinationCategory: "",
      sourceRange: [],
      destinationRange: [],
    };
    return map;
  }

  const processData = (data: string[] | undefined) => {
    if (data) {
      let seeds: number[] = [];
      const almanacMaps: AlmanacMap[] = [];
      let currentAlmanacMap = GetEmptyAlmanacMap();

      data.forEach((row) => {
        console.log("-----");
        console.log(row);
        if (row == "") {
          if (currentAlmanacMap.sourceCategory != "") {
            almanacMaps.push(currentAlmanacMap);
          }
          currentAlmanacMap = GetEmptyAlmanacMap();
          return;
        }

        const colonSplit = row.split(":");
        if (colonSplit.length > 1) {
          const heading = colonSplit[0];
          if (heading == "seeds") {
            const seedString = colonSplit[1];
            seeds = GetNumberArray(seedString);
            console.log(seeds);
            return;
          }

          const currentSection = heading.split(" ")[0];
          const [source, _, destination] = currentSection.split("-");
          currentAlmanacMap.sourceCategory = source;
          currentAlmanacMap.destinationCategory = destination;

          return;
        }

        const [destinationRangeStart, sourceRangeStart, rangeLength] =
          GetNumberArray(row);
      });

      console.log(almanacMaps);
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
}
