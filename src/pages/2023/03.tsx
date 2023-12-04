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
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
    example: true,
  }).data;

  const symbolRegex = /[^0-9.]/g;
  const digitRegex = /\d+/g;

  const processData = (data: string[] | undefined) => {
    if (data) {
      const validNumbersAndIndexesJSONSet = new Set<string>();
      const schematic: string[][] = getSchematic(data);
      const symbolIndexes: number[][] = getSymbolIndexes(schematic);

      if (symbolIndexes.length > 0) {
        for (let i = 0; i < Math.min(10, symbolIndexes.length); i++) {
          // }

          // symbolIndexes.forEach((symbolIndex) => {
          let symbolIndex = symbolIndexes[i];
          const [rowIndex, columnIndex] = symbolIndex;
          // console.log("----------------");
          // console.log("SYMBOL: " + rowIndex + ", " + columnIndex);

          const middleRow = data[rowIndex];
          // console.log(" - - - middle row - - - ");
          EvaluateRow(
            middleRow,
            columnIndex,
            validNumbersAndIndexesJSONSet,
            rowIndex,
          );

          const topRowIndex = rowIndex - 1;
          if (topRowIndex > -1) {
            const topRow = data[rowIndex - 1];
            // console.log(" - - - top row - - - ");
            EvaluateRow(
              topRow,
              columnIndex,
              validNumbersAndIndexesJSONSet,
              topRowIndex,
            );
          }

          const bottomRowIndex = rowIndex + 1;
          if (bottomRowIndex < data.length) {
            const bottomRow = data[rowIndex + 1];
            // console.log("- -  - - bottom row - - - -");
            EvaluateRow(
              bottomRow,
              columnIndex,
              validNumbersAndIndexesJSONSet,
              bottomRowIndex,
            );
          }
        }
      }

      const validNumbersAndIndexesJSONArray = Array.from(
        validNumbersAndIndexesJSONSet,
      );
      const validNumbersAndIndexes: number[][] =
        validNumbersAndIndexesJSONArray.map((x) => JSON.parse(x));
      const validNumbers = validNumbersAndIndexes.map((x) => x[0]);
      const validNumberSum = validNumbers.reduce((a, b) => a + b, 0);
      console.log(validNumbersAndIndexes);

      setParts({
        part1: validNumberSum,
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

  function EvaluateRow(
    row: string,
    columnIndex: number,
    validNumbers: Set<string>,
    rowIndex: number,
  ) {
    const [middle, middleIndex] = getMiddle(row, columnIndex);
    console.log("middle returned");
    console.log(middle);
    console.log(middleIndex);
    if (middle > 0) {
      console.log("middle: " + middle);
      validNumbers.add(JSON.stringify([middle, rowIndex, middleIndex]));
      validNumbers.add(JSON.stringify([middle, rowIndex, middleIndex]));
      return; // if there is a number in the middle we won't have diagonals or left or right
    }

    const [left, leftIndex] = getLeft(row, columnIndex, -1);
    if (left > 0) {
      console.log("left: " + left);
      validNumbers.add(JSON.stringify([left, rowIndex, leftIndex]));
      validNumbers.add(JSON.stringify([left, rowIndex, leftIndex]));
    }

    const [right, rightIndex] = getLeft(row, columnIndex, 1);
    if (right > 0) {
      console.log("right: " + right);
      validNumbers.add(JSON.stringify([right, rowIndex, rightIndex]));
      validNumbers.add(JSON.stringify([right, rowIndex, rightIndex]));
    }
  }

  function getMiddle(adjRow: string, symbolIndex: number): number[] {
    const possibleSymbol = Number(adjRow[symbolIndex]);
    if (isNaN(possibleSymbol)) {
      return [0, 0];
    }

    const maxLeft = Math.max(0, symbolIndex - 2);
    const maxRight = Math.min(adjRow.length, symbolIndex + 3);
    const stringUnderConsideration = adjRow.slice(maxLeft, maxRight);
    console.log("SUC: " + stringUnderConsideration);

    const matches = [...stringUnderConsideration.matchAll(digitRegex)];
    if (matches.length == 0) {
      return [0, 0];
    }

    const compatible: number[][] = [];
    matches.forEach((match) => {
      const indexLeft = match.index;
      const numberString = match[0];
      const indexRight = indexLeft + numberString.length;
      console.log(numberString + " " + indexLeft + "-" + indexRight);

      if (indexLeft > 2 || 2 > indexRight) {
        return;
      }

      console.log("in range");
      const middle = Number(numberString);
      console.log("!!!!!!" + middle);
      const matchIndex = indexLeft + maxLeft;
      compatible.push([middle, matchIndex]);
    });

    if (compatible.length == 0) {
      return [0, 0];
    }

    return compatible[0];
  }

  function getLeft(
    adjRow: string,
    symbolIndex: number,
    direction: sign,
  ): number[] {
    const noStuff = [0, 0];
    const aIndex = symbolIndex + 1 * direction;
    if (aIndex < 0 || aIndex > adjRow.length - 1) {
      return noStuff;
    }
    const ai = adjRow[aIndex];
    const a = Number(ai);
    if (isNaN(a)) {
      return noStuff;
    }

    const aStuff = [a, aIndex];
    const bIndex = symbolIndex + 2 * direction;
    if (bIndex < 0 || bIndex > adjRow.length - 1) {
      return aStuff;
    }
    const bi = adjRow[bIndex];
    const b = Number(bi);
    if (isNaN(b)) {
      return aStuff;
    }

    let bValue = "";
    if (direction == -1) {
      bValue = bi + ai;
    } else {
      bValue = ai + bi;
    }
    const bStuff = [Number(bValue), bIndex];
    const cIndex = symbolIndex + 3 * direction;
    if (cIndex < 0 || cIndex > adjRow.length - 1) {
      return bStuff;
    }
    const ci = adjRow[cIndex];
    const c = Number(ci);
    if (isNaN(c)) {
      return bStuff;
    }
    let cValue = "";
    if (direction == -1) {
      cValue = ci + bi + ai;
    } else {
      cValue = ai + bi + ci;
    }

    return [Number(cValue), cIndex];
  }

  function getSymbolIndexes(schematic: string[][]) {
    const symbolIndexes: number[][] = [];
    for (let rowIndex = 0; rowIndex < schematic.length; rowIndex++) {
      const row = schematic[rowIndex];
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const item = row[columnIndex];
        const match = [...item.matchAll(symbolRegex)];
        if (match.length > 0) {
          symbolIndexes.push([rowIndex, columnIndex]);
        }
      }
    }
    return symbolIndexes;
  }

  function getSchematic(data: string[]) {
    const schematic: string[][] = [];
    data.forEach((row) => {
      schematic.push(row.split(""));
    });
    return schematic;
  }

  type sign = 1 | -1;
}
