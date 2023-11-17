import { api } from "~/utils/api";
import { useState } from "react";

export default function puzzle() {
  const [part1, setPart1] = useState(0);
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
      setPart1(Math.max(...calories));
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
    </div>
  );
}
