import { api } from "~/utils/api";
import { useState } from "react";

export default function puzzle() {
  const [part1, setPart1] = useState(0);
  const [part2, setPart2] = useState(0);
  const inputFile = api.file.getInputFile.useQuery({ year: 2022, day: 1 });
  const data = inputFile.data;

  const processData = () => {
    console.log("processing data");
    if (data) {
      const numOfElves: number = data.filter((x) => x === "").length + 1;
      console.log("numberOfElves " + numOfElves);
      let calories: number[] = Array(numOfElves).fill(0);
      let elfIndex: number = 0;
      data.forEach((row) => {
        if (row === "") {
          elfIndex++;
        } else {
          calories[elfIndex] += Number(row);
        }
      });
      const maxCalories = Math.max(...calories);
      setPart1(maxCalories);

      const sortedCalories = calories
        .sort(function (a, b) {
          return a - b;
        })
        .reverse();
      const top3Calories: number[] = sortedCalories.slice(0, 3);
      console.log(
        "top 3 elves: " +
          top3Calories[0] +
          ", " +
          top3Calories[1] +
          ", " +
          top3Calories[2],
      );
      const top3CaloriesSum: number = top3Calories.reduce(
        (sum, a) => sum + a,
        0,
      );

      setPart2(top3CaloriesSum);
    }
  };

  const handleGetResults = async () => {
    processData();
  };

  return (
    <div>
      <button
        onClick={handleGetResults}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Get Results
      </button>
      <div>Part 1: {part1}</div>
      <div>Part 2: {part2}</div>
    </div>
  );
}
