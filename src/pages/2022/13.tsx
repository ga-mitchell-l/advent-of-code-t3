import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day10() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 13;
  const data: string[] = api.file.getInputFile.useQuery({
    year: 2022,
    day: day,
  }).data;
  const exampleData: string[] = api.file.getInputFile.useQuery({
    year: 2022,
    day: day,
    example: true,
  }).data;

  const processData = (data: string[] | undefined) => {
    if (data) {
      let correctOrder = 0;
      for (let i = 0; i < data.length; i += 3) {
        const packetA = data[i];
        const packetB = data[i + 1];

        const arrayA = ParseStringToArray(packetA);
        const arrayB = ParseStringToArray(packetB);

        console.log("packet A: ");
        console.log(arrayA);
        console.log("packet B: ");
        console.log(arrayB);

        console.log("---------------");
      }

      setParts({
        part1: correctOrder,
        part2: 0,
      });
    }
  };

  function ParseStringToArray(str) {
    var i = 0;
    function main() {
      var arr = [];
      var startIndex = i;
      function addWord() {
        if (i - 1 > startIndex) {
          arr.push(Number(str.slice(startIndex, i - 1)));
        }
      }
      while (i < str.length) {
        switch (str[i++]) {
          case ",":
            addWord();
            startIndex = i;
            continue;
          case "[":
            arr.push(main());
            startIndex = i;
            continue;
          case "]":
            addWord();
            return arr;
        }
      }
      addWord();
      return arr;
    }
    return main();
  }

  return (
    <Puzzle
      handleGetResults={() => processData(data)}
      handleExampleGetResults={() => processData(exampleData)}
      day={day}
      results={parts}
    ></Puzzle>
  );
}
