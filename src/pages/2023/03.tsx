import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";
import { sign } from "crypto";

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
  const splitRegex = /[^0-9]/g;
  const regex = /\d+/g;

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part1 = 0;
      const validNumbers = new Set<number[]>();

      const schematic: string[][] = getSchematic(data);
      const symbolIndexes: number[][] = getSymbolIndexes(schematic);
      if (symbolIndexes.length > 0) {
        for (let i = 0; i < 10; i++) {
          // }

          // symbolIndexes.forEach((symbolIndex) => {
          let symbolIndex = symbolIndexes[i];
          // console.log(symbolIndex);
          const [rowIndex, columnIndex] = symbolIndex;
          console.log("----------------");
          console.log("SYMBOL: " + rowIndex + ", " + columnIndex);

          const middleRow = data[rowIndex];
          const farb = middleRow.slice(columnIndex - 3, columnIndex + 3);
          console.log("middle row: " + farb);
          const [left, leftIndex] = getLeft(middleRow, columnIndex, -1);
          if (left > 0) {
            console.log("left: " + left);
            validNumbers.add([left, rowIndex, leftIndex]);
          }

          // const topRowIndex = rowIndex - 1;
          // if (topRowIndex > 0) {
          //   const topRow = data[rowIndex - 1];
          // }

          // const bottomRowIndex = rowIndex + 1;
          // if (bottomRowIndex < data.length) {
          //   const bottomRow = data[rowIndex + 1];
          // }
        }
      }

      console.log(validNumbers);

      setParts({
        part1: 0,
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
      console.log("return 1");
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

    const bStuff = [Number(bi + ai), bIndex];
    const cIndex = symbolIndex + 3 * direction;
    if (cIndex < 0 || cIndex > adjRow.length - 1) {
      return bStuff;
    }
    const ci = adjRow[cIndex];
    const c = Number(ci);
    if (isNaN(c)) {
      return bStuff;
    }

    return [Number(ci + bi + ai), cIndex];
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
