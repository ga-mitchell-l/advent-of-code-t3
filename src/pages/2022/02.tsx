import { api } from "~/utils/api";
import { useState } from "react";
import Results from "../../components/Results";

export default function Day02() {
  const [part1, setPart1] = useState(0);
  const [part2, setPart2] = useState(0);
  const data = api.file.getInputFile.useQuery({ year: 2022, day: 2 }).data;

  const processData = () => {
    if (data) {
      let part1Score: number = 0;
      let part2Score: number = 0;
      //   let exampleData = ["A Y", "B X", "C Z"];
      data.forEach((row: string) => {
        let splitRow = row.split(" ");
        // A Rock, B Paper, C Scissors
        // X Rock, Y Paper, Z Scissors

        if (splitRow.length == 2) {
          // part 1
          switch (splitRow[1]) {
            case "X":
              part1Score += 1;
              part1Score += GetWinScore(splitRow[0], "C", "A");
              break;
            case "Y":
              part1Score += 2;
              part1Score += GetWinScore(splitRow[0], "A", "B");
              break;
            case "Z":
              part1Score += 3;
              part1Score += GetWinScore(splitRow[0], "B", "C");
              break;
          }

          // part 2
          // X lose, Y draw, Z win
          switch (splitRow[1]) {
            case "X":
              // lose
              part2Score += 0;

              switch (splitRow[0]) {
                case "A":
                  // rock
                  // means I have to play scissors
                  part2Score += 3;
                  break;
                case "B":
                  // paper
                  // means I have to play rock
                  part2Score += 1;
                  break;
                case "C":
                  // scissors
                  // means I have to play paper
                  part2Score += 2;
                  break;
              }
              break;
            case "Y":
              // draw
              part2Score += 3;
              switch (splitRow[0]) {
                case "A":
                  // rock
                  // means I have to play rock
                  part2Score += 1;
                  break;
                case "B":
                  // paper
                  // means I have to play paper
                  part2Score += 2;
                  break;
                case "C":
                  // scissors
                  // means I have to play scissors
                  part2Score += 3;
                  break;
              }
              break;
            case "Z":
              // win
              part2Score += 6;
              switch (splitRow[0]) {
                case "A":
                  // rock
                  // means I have to play paper
                  part2Score += 2;
                  break;
                case "B":
                  // paper
                  // means I have to play scissors
                  part2Score += 3;
                  break;
                case "C":
                  // scissors
                  // means I have to play rock
                  part2Score += 1;
                  break;
              }
              break;
          }
        }
      });

      setPart1(part1Score);
      setPart2(part2Score);
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

  return (
    <Results
      handleGetResults={processData}
      part1={part1}
      part2={part2}
      day={2}
    ></Results>
  );
}
