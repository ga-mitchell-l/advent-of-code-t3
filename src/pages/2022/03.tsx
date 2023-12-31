import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day03() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });
  const day = 3;
  const data = api.file.getInputFile.useQuery({ year: 2022, day: day }).data;
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
    "",
  );
  const exampleData = [
    "vJrwpWtwJgWrhcsFMMfFFhFp",
    "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
    "PmmdzqPrVvPwwTWBwg",
    "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
    "ttgJtRGJQctTZtZT",
    "CrZsJsPPZsGzwwsLwLmpwMDw",
  ];

  const getPriority = (letter: string): number => {
    return letters.indexOf(letter) + 1;
  };

  const processData = (data: string[] | undefined) => {
    if (data) {
      let totalPriority = 0;
      data.forEach((row: string) => {
        // part one
        const halfWay = Math.floor(row.length / 2);
        const compartmentOne = row.slice(0, halfWay).split("");
        const compartmentTwo = row.slice(halfWay, row.length).split("");

        const intersection = [...new Set(compartmentOne)].filter(
          Set.prototype.has,
          new Set(compartmentTwo),
        );

        intersection.forEach((letter: string) => {
          totalPriority += getPriority(letter);
        });
      });

      let teamPriority = 0;
      for (let i = 0; i < data.length; i += 3) {
        const elfOne = data[i];
        const elfTwo = data[i + 1];
        const elfThree = data[i + 2];

        const intersection1 = [...new Set(elfOne)].filter(
          Set.prototype.has,
          new Set(elfTwo),
        );
        const intersection2 = [...new Set(intersection1)].filter(
          Set.prototype.has,
          new Set(elfThree),
        );

        intersection2.forEach((letter: string) => {
          teamPriority += getPriority(letter);
        });
      }

      setParts({
        part1: totalPriority,
        part2: teamPriority,
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
}
