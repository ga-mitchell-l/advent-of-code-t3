import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day10() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 10;
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
      let cycle = 1;
      let x = 1;
      let inputLineNumber = 0;
      let previousCmd = "";
      const signalStrength = {};
      const CRT = new Array<Array<string>>(6);

      for (let i = 0; i < CRT.length; i++) {
        CRT[i] = new Array<string>(40).fill("");
      }

      while (data[inputLineNumber]) {
        signalStrength[cycle] = x * cycle;
        const CRTi = (cycle - 1) % 40;
        const CRTj = Math.floor((cycle - 1) / 40);

        const spriteInPixel = x - 1 == CRTi || x == CRTi || x + 1 == CRTi;
        CRT[CRTj][CRTi] = spriteInPixel ? "#" : ".";

        if (previousCmd) {
          inputLineNumber++;
          const [_, numerator] = previousCmd.split(" ");
          x += Number(numerator);
          previousCmd = "";
        } else {
          const [command, _] = data[inputLineNumber].split(" ");
          if (command == "noop") {
            inputLineNumber++;
          } else if (command == "addx") {
            previousCmd = data[inputLineNumber];
          }
        }

        cycle++;
      }

      let signalStrengthSum = 0;
      for (let i = 20; i <= 220; i += 40) {
        signalStrengthSum += signalStrength[i];
      }

      CRT.forEach((row) => {
        console.log(row.join());
      });

      setParts({
        part1: signalStrengthSum,
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
}
