import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";
import { GetNumberArray } from "@utils/react";

export default function Day09() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 9;
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = [
    "0 3 6 9 12 15",
    "1 3 6 10 15 21",
    "10 13 16 21 30 45",
  ];

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part1Sum = 0;
      data.forEach((row) => {
        const sequence = GetNumberArray(row);

        const history: number[][] = getHistory(sequence);
        for (let i = 1; i < history.length + 1; i++) {
          const currentSequence = history[history.length - i];
          part1Sum += currentSequence[currentSequence.length - 1];
        }
      });

      setParts({
        part1: part1Sum,
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

  function getHistory(sequence: number[]) {
    const history: number[][] = [];
    history.push(sequence);

    while (
      history[history.length - 1].filter((x) => x == 0).length !=
      history[history.length - 1].length
    ) {
      const newSequence: number[] = [];
      const currentSequence = history[history.length - 1];
      for (let i = 1; i < currentSequence.length; i++) {
        const diff = currentSequence[i] - currentSequence[i - 1];
        newSequence.push(diff);
      }
      history.push(newSequence);
    }
    return history;
  }
}
