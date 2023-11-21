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

  const processData = () => {
    if (data) {
      let count: number = 0;
      data.forEach((row: string) => {
        let i: number = 0;
        let elfArray = [...Array(2)];
        const elves: string[] = row.split(",");
        elves.forEach((elf: string) => {
          elfArray[i] = elf.split("-");
          i += 1;
        });
        const A: number = Number(elfArray[0][0]);
        const B: number = Number(elfArray[0][1]);
        const C: number = Number(elfArray[1][0]);
        const D: number = Number(elfArray[1][1]);

        const leftContainsRight: boolean = C >= A && D <= B;
        const rightContainsLeft: boolean = A >= C && B <= D;

        if (leftContainsRight || rightContainsLeft) {
          count++;
        }
      });
      setPart1(count);
    }
  };

  return (
    <Results
      handleGetResults={processData}
      part1={part1}
      part2={part2}
      day={4}
    ></Results>
  );
}
