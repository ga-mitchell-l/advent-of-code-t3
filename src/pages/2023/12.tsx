import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day12() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 12;
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = [
    "???.### 1,1,3",
    ".??..??...?##. 1,1,3",
    "?#?#?#?#?#?#?#? 1,3,1,6",
    "????.#...#... 4,1,1",
    "????.######..#####. 1,6,5",
    "?###???????? 3,2,1",
  ];
  const processData = (data: string[] | undefined) => {
    if (data) {
      data = ["???.### 1,1,3"];
      data.forEach((row) => {
        let [hotspringString, groupingsString] = row.split(" ");
        const hotsprings = hotspringString.split("");
        const groupings = groupingsString.split(",").map((x) => Number(x));

        if (hotspringString[0] != ".") {
          hotspringString = "." + hotspringString;
        }
        if (hotspringString[hotspringString.length - 1] != ".") {
          hotspringString = hotspringString + ".";
        }
        console.log(hotspringString);

        groupings.forEach((grouping) => {
          const regexString = `([\.\?][\?]{${grouping}[\.\?])+`;
          // console.log(regexString);
          // const regex = new RegExp(regexString, "g");
          const regex = /([\.\?][\?#]{3}[\.\?])+/g;
          const match = hotspringString.match(regex);
          console.log(match);
        });

        console.log("-----");
      });
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
