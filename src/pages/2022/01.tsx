import { api } from "~/utils/api";
import { useState } from "react";
import { PartResults } from "~/classes/PuzzleResults";
import Puzzle from "~/components/Puzzle";

export default function Day01() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });
  const data = api.file.getInputFile.useQuery({ year: 2022, day: 1 }).data;
  const exampleData = [
    "1000",
    "2000",
    "3000",
    "",
    "4000",
    "",
    "5000",
    "6000",
    "",
    "7000",
    "8000",
    "9000",
    "",
    "10000",
  ];

  const processData = (data: string[] | undefined) => {
    if (data) {
      const numOfElves: number = data.filter((x) => x === "").length + 1;
      let calories: number[] = Array(numOfElves).fill(0);
      let elfIndex: number = 0;
      data.forEach((row: string) => {
        if (row === "") {
          elfIndex++;
        } else {
          calories[elfIndex] += Number(row);
        }
      });
      const maxCalories: number = Math.max(...calories);

      const sortedCalories: number[] = calories
        .sort(function (a, b) {
          return a - b;
        })
        .reverse();
      const top3Calories: number[] = sortedCalories.slice(0, 3);
      const top3CaloriesSum: number = top3Calories.reduce(
        (sum, a) => sum + a,
        0,
      );

      setParts({
        part1: maxCalories,
        part2: top3CaloriesSum,
      });
    }
  };
  return (
    <Puzzle
      handleGetResults={() => {
        processData(data);
      }}
      results={parts}
      day={1}
    ></Puzzle>
  );
}
