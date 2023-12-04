import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day01() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });
  const numberDict = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    zero: 0,
  };

  const day = 1;
  const data: string[] = api.file.getInputFile.useQuery({
    year: 2023,
    day: day,
  }).data;
  const exampleData: string[] = [
    "1abc2",
    "pqr3stu8vwx",
    "a1b2c3d4e5f",
    "treb7uchet",
  ];
  const exampleData2: string[] = [
    "two1nine",
    "eightwothree",
    "abcone2threexyz",
    "xtwone3four",
    "4nineeightseven2",
    "zoneight234",
    "7pqrstsixteen",
  ];

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part1 = 0;
      let part2 = 0;
      data.forEach((row) => {
        const part1Row = Part1(row);
        part1 += part1Row;

        const part2Row = Part2(row);
        part2 += part2Row;
      });
      setParts({
        part1: part1,
        part2: part2,
      });
    }
  };

  return (
    <Puzzle
      handleGetResults={() => processData(data)}
      handleExampleGetResults={() => processData(exampleData2)}
      day={day}
      results={parts}
    ></Puzzle>
  );

  function Part1(row: string): number {
    const numbers = getNumbers(row);
    if (numbers.length == 0) {
      return 0;
    }
    const result = getDayOne(numbers);
    return result;
  }

  function getNumbers(row: string) {
    const characters = row.split("").map(Number);
    const numbers = characters.filter((x) => !isNaN(x));
    return numbers;
  }

  function getDayOne(numbers: number[]) {
    const first = numbers[0];
    const last = numbers[numbers.length - 1];
    const combination = first.toString() + last.toString();
    const result = Number(combination);
    return result;
  }

  function reverseString(string: string) {
    return string.split("").reverse().join("");
  }

  function replaceAt(
    original: string,
    index: number,
    replacement: string,
  ): string {
    return (
      original.substring(0, index) + replacement + original.substring(index + 1)
    );
  }

  function Part2(row: string): number {
    let reverseRow = reverseString(row);
    for (let i = 0; i < row.length; i++) {
      for (const key in numberDict) {
        const keylength = key.length;
        const keyslice = row.slice(i, i + keylength);
        if (keyslice == key) {
          row = replaceAt(row, i, numberDict[key]);
        }
        const reverseKey = reverseString(key);
        const reverseKeyslice = reverseRow.slice(i, i + keylength);
        if (reverseKeyslice == reverseKey) {
          reverseRow = replaceAt(reverseRow, i, numberDict[key]);
        }
      }
    }

    const left = getNumbers(row);
    const right = getNumbers(reverseRow);

    const result = left[0].toString() + right[0].toString();

    return Number(result);
  }
}
