import { api } from "~/utils/api";
import { useState } from "react";

export default function Day02() {
  const [part1, setPart1] = useState(0);
  const [part2, setPart2] = useState(0);
  const inputFile = api.file.getInputFile.useQuery({ year: 2022, day: 2 });
  const data = inputFile.data;

  const processData = () => {
    if (data) {
      let score: number = 0;
      data.forEach((row: string) => {
        let splitRow = row.split(" ");
        // A Rock, B Paper, C Scissors
        // X Rock, Y Paper, Z Scissors

        if (splitRow.length == 2) {
          switch (splitRow[1]) {
            case "X":
              score += 1;
              score += GetWinScore(splitRow[0], "C", "A");
              break;
            case "Y":
              score += 2;
              score += GetWinScore(splitRow[0], "A", "B");
              break;
            case "Z":
              score += 3;
              score += GetWinScore(splitRow[0], "B", "C");
              break;
          }
        }
      });
      setPart1(score);
    }
  };

  function GetWinScore(
    row: string | undefined,
    winCase: string,
    drawCase: string,
  ): number {
    let score = 0;
    switch (row) {
      case winCase:
        score += 6;
        break;
      case drawCase:
        score += 3;
        break;
    }
    return score;
  }

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
