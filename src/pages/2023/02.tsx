import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day02() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 2;
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
    example: true,
  }).data;

  const redMax = 12;
  const greenMax = 13;
  const blueMax = 14;
  const digitRegex = /\d+/g;

  const processData = (data: string[] | undefined) => {
    if (data) {
      // data = ["Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"];
      let idSum = 0;
      let powerSum = 0;

      data.forEach((row) => {
        const [game, cubes] = row.split(": ");
        const rowId = getDigit(game);
        const handfulls = cubes.split("; ");
        const handfulPossible: boolean[] = [];

        let greenMaxRow = 0;
        let blueMaxRow = 0;
        let redMaxRow = 0;

        handfulls.forEach((handfull) => {
          const die = handfull.split(", ");
          die.forEach((dice) => {
            let [stringQuantity, colour] = dice.split(" ");
            const quantity = Number(stringQuantity);
            switch (colour) {
              case "red":
                handfulPossible.push(quantity <= redMax);
                redMaxRow = Math.max(redMaxRow, quantity);
                break;
              case "green":
                handfulPossible.push(quantity <= greenMax);
                greenMaxRow = Math.max(greenMaxRow, quantity);
                break;
              case "blue":
                handfulPossible.push(quantity <= blueMax);
                blueMaxRow = Math.max(blueMaxRow, quantity);
                break;
            }
          });
        });
        if (handfulPossible.filter((x) => !x).length == 0) {
          // if there are no impossibles, it's possible
          idSum += rowId;
        }

        const power = redMaxRow * greenMaxRow * blueMaxRow;
        powerSum += power;
      });

      setParts({
        part1: idSum,
        part2: powerSum,
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

  function getDigit(game: string): number {
    const match: RegExpMatchArray[] = [...game.matchAll(digitRegex)];
    return Number(match[0]);
  }
}
