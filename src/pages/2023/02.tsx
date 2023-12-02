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
      let idSum = 0;

      data.forEach((row) => {
        const [game, cubes] = row.split(": ");
        const rowId = getDigit(game);
        const handfulls = cubes.split("; ");
        const handfulPossible: boolean[] = [];

        handfulls.forEach((handfull) => {
          const die = handfull.split(", ");
          die.forEach((dice) => {
            let [stringQuantity, colour] = dice.split(" ");
            const quantity = Number(stringQuantity);
            switch (colour) {
              case "red":
                handfulPossible.push(quantity <= redMax);
              case "green":
                handfulPossible.push(quantity <= greenMax);
              case "blue":
                handfulPossible.push(quantity <= blueMax);
            }
          });
        });
        if (handfulPossible.filter((x) => !x).length == 0) {
          // if there are no impossibles, it's possible
          idSum += rowId;
          console.log("possible!");
        }
      });

      setParts({
        part1: idSum,
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

  function getDigit(game: string): number {
    const match: RegExpMatchArray[] = [...game.matchAll(digitRegex)];
    return Number(match[0]);
  }
}
