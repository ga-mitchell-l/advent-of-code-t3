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

  type Day01 = {
    digit: number;
    index: number;
  };

  const processData = (data: string[] | undefined) => {
    data = ["two1nine", "eightwothree"];
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
    toReplaceLength: number,
  ): string {
    return (
      original.substring(0, index) +
      replacement +
      original.substring(index + toReplaceLength)
    );
  }

  function Part2(row: string): number {
    let reverseRow = reverseString(row);
    for (let key in numberDict) {
      console.log("row: " + row);
      const value = numberDict[key].toString();

      while (row.indexOf(key) > -1) {
        // console.log("FROM THE LEFT FROM THE LEFT");
        // console.log("key: " + key);
        const indexOf = row.indexOf(key);
        row = replaceAt(row, indexOf, value, key.length);
      }

      let reverseKey = reverseString(key);
      while (reverseRow.indexOf(reverseKey) > -1) {
        // console.log("FROM THE RIGHT FROM THE RIGHT");
        // console.log("reverse key: " + reverseKey);
        // console.log("reverse row: " + reverseRow);
        const indexOf = reverseRow.indexOf(reverseKey);
        // console.log("index: " + indexOf);
        reverseRow = replaceAt(reverseRow, indexOf, value, key.length);
      }
    }
    console.log(row);
    console.log(reverseRow);

    const left = getNumbers(row);
    const right = getNumbers(reverseRow);

    const result = left[0].toString() + right[0].toString();
    console.log(result);

    return Number(result);
  }
}
