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
      let correctOrderCount = 0;
      for (let i = 3; i < 6; i += 3) {
        const packetA = data[i];
        const packetB = data[i + 1];

        const arrayA = JSON.parse(packetA);
        const arrayB = JSON.parse(packetB);

        console.log("packet A: ");
        console.log(arrayA);
        console.log("packet B: ");
        console.log(arrayB);

        const correctOrder: boolean = CompareRecursively(arrayA, arrayB);
        console.log("correct order: " + correctOrder);
        if (correctOrder) {
          correctOrderCount++;
        }

        console.log("---------------");
      }

      setParts({
        part1: correctOrderCount,
        part2: 0,
      });
    }
  };

  function CompareRecursively(arrayA: any[], arrayB: any[]): boolean {
    console.log("comparing");
    console.log("A");
    console.log(arrayA);
    console.log("B");
    console.log(arrayB);
    let i = 0;
    while (i < Math.min(arrayA.length, arrayB.length)) {
      console.log("1");
      const existsA = i < arrayA.length;
      const existsB = i < arrayB.length;

      if (!existsA && existsB) {
        console.log("RETURN 1");
        return true;
      } else if (existsA && !existsB) {
        console.log("RETURN 2");
        return false;
      } else {
        console.log("2");
        const valueA = arrayA[i];
        const valueB = arrayB[i];
        console.log(valueA);
        console.log(valueA);

        const valueAIsNumber = typeof valueA == "number";
        const valueBIsNumber = typeof valueB == "number";
        console.log(valueAIsNumber);
        console.log(valueBIsNumber);

        if (valueAIsNumber && valueBIsNumber) {
          if (valueA != valueB) {
            console.log("RETURN 3: " + (valueA < valueB));
            return valueA < valueB;
          }
        } else if (valueAIsNumber && !valueBIsNumber) {
          const newList = [valueA];
          return CompareRecursively(newList, valueB);
        } else if (valueBIsNumber && !valueAIsNumber) {
          const newList = [valueB];
          return CompareRecursively(valueA, newList);
        } else {
          console.log("hello");
          return CompareRecursively(valueA, valueB);
        }
      }

      i++;
    }
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
