import { api } from "~/utils/api";
import { useState } from "react";
import Results from "../../components/Results";

export default function Day04() {
  const [part1, setPart1] = useState(0);
  const [part2, setPart2] = useState(0);
  const data = api.file.getInputFile.useQuery({ year: 2022, day: 4 }).data;
  const exampleData: string[] = [
    "2-4,6-8",
    "2-3,4-5",
    "5-7,7-9",
    "2-8,3-7",
    "6-6,4-6",
    "2-6,4-8",
  ];

  type Range = [number, number];

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part1Count: number = 0;
      let part2Count: number = 0;
      data.forEach((row: string) => {
        let i: number = 0;
        let elfArray = [...Array(2)];
        const elves: string[] = row.split(",");
        elves.forEach((elf: string) => {
          elfArray[i] = elf.split("-").map(Number);
          i += 1;
        });

        if (RangeContains(elfArray[0], elfArray[1])) {
          part1Count++;
        }

        if (RangeOverlaps(elfArray[0], elfArray[1])) {
          part2Count++;
        }
      });
      setPart1(part1Count);
      setPart2(part2Count);
    }
  };

  const RangeContains = (rangeX: Range, rangeY: Range) => {
    return (
      (rangeY[0] >= rangeX[0] && rangeY[1] <= rangeX[1]) ||
      (rangeX[0] >= rangeY[0] && rangeX[1] <= rangeY[1])
    );
  };

  const RangeOverlaps = (rangeX: Range, rangeY: Range) => {
    return (
      (rangeX[0] <= rangeY[0] && rangeY[0] <= rangeX[1]) ||
      (rangeY[0] <= rangeX[0] && rangeX[0] <= rangeY[1])
    );
  };

  return (
    <Results
      handleGetResults={() => {
        processData(data);
      }}
      part1={part1}
      part2={part2}
      day={4}
    ></Results>
  );
}
