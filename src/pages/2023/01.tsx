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
    data = ["sevenine", "eighteightwo"];
    if (data) {
      let part1 = 0;
      let part2 = 0;
      data.forEach((row) => {
        console.log("part 1");
        const part1Row = Part1(row);
        part1 += part1Row;

        console.log("part 2");
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
    console.log(row);
    const characters = row.split("").map(Number);
    const numbers = characters.filter((x) => !isNaN(x));
    if (numbers.length == 0) {
      return 0;
    }
    const result = getDayOne(numbers);
    return result;
  }

  function getDayOne(numbers: number[]) {
    console.log(numbers);
    const first = numbers[0];
    const last = numbers[numbers.length - 1];
    const combination = first.toString() + last.toString();
    const result = Number(combination);
    return result;
  }

  function Part2(row: string): number {
    const numbersAndIndexes: Day01[] = [];

    for (let i = 0; i < 10; i++) {
      let tempRow = row;
      while (tempRow.indexOf(i.toString()) > -1) {
        const indexOf = row.indexOf(i.toString());
        const numberAndIndex: Day01 = { digit: i, index: indexOf };
        tempRow = tempRow.slice(indexOf + 1);
        numbersAndIndexes.push(numberAndIndex);
      }
    }

    for (let key in numberDict) {
      let tempRow = row;
      while (tempRow.indexOf(key) > -1) {
        const indexOf = row.indexOf(key);
        const numberAndIndex: Day01 = {
          digit: numberDict[key],
          index: indexOf,
        };
        tempRow = tempRow.slice(indexOf + 1);
        numbersAndIndexes.push(numberAndIndex);
      }
    }

    numbersAndIndexes.sort(function (a, b) {
      return a.index - b.index;
    });

    const justNumbers = numbersAndIndexes.map((x) => x.digit);
    console.log(justNumbers);
    const result = getDayOne(justNumbers);

    return result;
  }
}
