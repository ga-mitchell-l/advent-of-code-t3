import { api } from "~/utils/api";
import { useState } from "react";
import Results from "../../components/Results";

export default function Day03() {
  const [part1, setPart1] = useState(0);
  const [part2, setPart2] = useState(0);
  const data = api.file.getInputFile.useQuery({ year: 2022, day: 3 }).data;
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
    "",
  );

  const getPriority = (letter: string): number => {
    return letters.indexOf(letter) + 1;
  };

  const processData = () => {
    const exampleData = [
      "vJrwpWtwJgWrhcsFMMfFFhFp",
      "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
      "PmmdzqPrVvPwwTWBwg",
      "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
      "ttgJtRGJQctTZtZT",
      "CrZsJsPPZsGzwwsLwLmpwMDw",
    ];
    if (data) {
      let totalPriority: number = 0;
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
      setPart1(totalPriority);

      let teamPriority: number = 0;
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
          console.log("team priority: " + getPriority(letter));
        });
      }
      setPart2(teamPriority);
    }
  };

  return (
    <Results
      handleGetResults={processData}
      part1={part1}
      part2={part2}
      day={3}
    ></Results>
  );
}
