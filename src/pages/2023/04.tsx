import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day04() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 4;
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = [
    "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
    "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
    "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
    "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
    "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
    "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
  ];

  const processData = (data: string[] | undefined) => {
    // list of winning numbers and then a list of numbers you have seperated by a vertical bar
    // you have to figure out which of the numbers you have appear in the list of winning numbers.
    // The first match makes the card worth one point and each match after the first doubles the point value of that card.
    // data = ["Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53"];
    if (data) {
      let totalScratchCardPoints = 0;
      data.forEach((row) => {
        console.log("-----------");
        console.log(row);
        const [_, numbers] = row.split(":");
        const [winning, my] = numbers.split("|");

        const winningNumbers = getNumberArray(winning);
        const myNumbers = getNumberArray(my);

        const myWinningNumbers = winningNumbers.filter((x) =>
          myNumbers.includes(x),
        );
        console.log("my winning numbers");

        console.log(myWinningNumbers);
        const winningCount = myWinningNumbers.length;
        console.log("number of winners: " + winningCount);

        let points = 0;
        if (winningCount != 0) {
          points = 2 ** (winningCount - 1);
        }

        console.log("POINTS: " + points);
        totalScratchCardPoints += points;
      });

      setParts({
        part1: totalScratchCardPoints,
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

  function getNumberArray(my: string) {
    return my
      .split(" ")
      .filter((x) => x != "")
      .map((x) => Number(x));
  }
}
