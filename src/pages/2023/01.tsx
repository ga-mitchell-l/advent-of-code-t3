import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day01() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 1;
  const data: string[] = api.file.getInputFile.useQuery({
    year: 2023,
    day: day,
  }).data;
  const exampleData: string[] = [
    "1abc2",
    "pqr3stu8vwx",
    "a1b2c3d4e5f",
    "treb7uchet",
  ];

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part1 = 0;
      data.forEach((row) => {
        const characters = row.split("").map(Number);
        const numbers = characters.filter((x) => !isNaN(x));
        const first = numbers[0];
        const last = numbers[numbers.length - 1];
        const combination = first.toString() + last.toString();
        part1 += Number(combination);
      });
      setParts({
        part1: part1,
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
