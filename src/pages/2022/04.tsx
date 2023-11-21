import { api } from "~/utils/api";
import { useState } from "react";
import Results from "../../components/Results";

export default function Day04() {
  const [part1, setPart1] = useState(0);
  const [part2, setPart2] = useState(0);
  const data = api.file.getInputFile.useQuery({ year: 2022, day: 4 }).data;
  const exampleData: string[] = [];

  const processData = () => {
    if (data) {
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
