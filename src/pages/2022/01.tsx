import { api } from "~/utils/api";
import { useState } from "react";
import Results from "../../components/Results";

export default function Day01() {
  const [part1, setPart1] = useState(0);
  const [part2, setPart2] = useState(0);
  const data = api.file.getInputFile.useQuery({ year: 2022, day: 2 }).data;

  const processData = () => {
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
      setPart1(maxCalories);

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

      setPart2(top3CaloriesSum);
    }
  };
  return (
    <Results
      handleGetResults={processData}
      part1={part1}
      part2={part2}
      day={1}
    ></Results>
  );
}
