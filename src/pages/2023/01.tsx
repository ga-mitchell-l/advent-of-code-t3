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
    const characters = row.split("").map(Number);
    const numbers = characters.filter((x) => !isNaN(x));
    if (numbers.length == 0) {
      return 0;
    }
    const result = getDayOne(numbers);
    return result;
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
    const numbersAndIndexesLeft: Day01[] = JSON.parse(
      JSON.stringify(numbersAndIndexes),
    );
    const numbersAndIndexesRight: Day01[] = JSON.parse(
      JSON.stringify(numbersAndIndexes),
    );

    for (let key in numberDict) {
      console.log("row: " + row);
      let tempRowLeft = row;
      while (tempRowLeft.indexOf(key) > -1) {
        console.log("FROM THE LEFT FROM THE LEFT");
        console.log("key: " + key);
        const indexOf = row.indexOf(key);
        const numberAndIndex: Day01 = {
          digit: numberDict[key],
          index: indexOf,
        };
        tempRowLeft = tempRowLeft.slice(indexOf + 1);
        numbersAndIndexesLeft.push(numberAndIndex);
      }

      let reverseRow = reverseString(row);
      let tempRowRight = reverseRow;
      let reverseKey = reverseString(key);
      let max = 0;
      while (tempRowRight.indexOf(reverseKey) > -1) {
        console.log("FROM THE RIGHT FROM THE RIGHT");
        console.log("reverse key: " + reverseKey);
        console.log("temp row right: " + tempRowRight);
        const indexOf = reverseRow.indexOf(reverseKey);
        console.log("index: " + indexOf);
        const numberAndIndex: Day01 = {
          digit: numberDict[key],
          index: row.length - indexOf - key.length,
        };
        tempRowRight = tempRowRight.slice(indexOf + 1);
        numbersAndIndexesRight.push(numberAndIndex);
        max++;
      }
    }
    console.log(numbersAndIndexesLeft);
    console.log(numbersAndIndexesRight);

    numbersAndIndexesLeft.sort(function (a, b) {
      return a.index - b.index;
    });

    numbersAndIndexesRight.sort(function (a, b) {
      return a.index - b.index;
    });

    const justNumbersLeft = numbersAndIndexesLeft.map((x) => x.digit);
    const justNumbersRight = numbersAndIndexesRight.map((x) => x.digit);
    console.log(justNumbersLeft);
    console.log(justNumbersRight);

    const left = justNumbersLeft[0];
    const right = justNumbersRight[justNumbersRight.length - 1];

    const foo = left.toString() + right.toString();
    const result = Number(foo);

    return result;
  }
}
