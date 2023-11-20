import { api } from "~/utils/api";
import { useState } from "react";

export default function Day02() {
  const [part1, setPart1] = useState(0);
  const [part2, setPart2] = useState(0);
  const inputFile = api.file.getInputFile.useQuery({ year: 2022, day: 2 });
  const data = inputFile.data;

  const processData = () => {};

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
