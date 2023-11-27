import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import { PartResults } from "~/classes/PuzzleResults";

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
      let signalStrength = {};

      while (data[inputLineNumber]) {
        console.log("_____________");
        signalStrength[cycle] = x * cycle;

        console.log(data[inputLineNumber]);
        if (previousCmd) {
          console.log("previous cmd: " + previousCmd);
          // set previous command to nothing
          inputLineNumber++;
          const [_, numerator] = previousCmd.split(" ");
          x += Number(numerator);
          previousCmd = "";
        } else {
          console.log("no previous cmd");
          const [command, _] = data[inputLineNumber].split(" ");
          if (command == "noop") {
            inputLineNumber++;
          } else if (command == "addx") {
            previousCmd = data[inputLineNumber];
          }
        }
        // signalStrength[cycle] = x * cycle;
        console.log("cycle: " + cycle);
        console.log("x: " + x);
        console.log("signal strength: " + signalStrength[cycle]);

        cycle++;
      }

      const signalStrengthSum =
        signalStrength[20] +
        signalStrength[60] +
        signalStrength[100] +
        signalStrength[140] +
        signalStrength[180] +
        signalStrength[220];

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
