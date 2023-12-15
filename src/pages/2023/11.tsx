import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day11() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 11;
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = [
    "...#......",
    ".......#..",
    "#.........",
    "..........",
    "......#...",
    ".#........",
    ".........#",
    "..........",
    ".......#..",
    "#...#.....",
  ];

  const processData = (data: string[] | undefined) => {
    if (data) {
      const universe: string[][] = [];
      data.forEach((row) => {
        const splitRow = row.split("");
        universe.push(splitRow);
      });

      const emptyRows = getEmptyRows(universe);
      console.log(emptyRows);

      const transposedUniverse = transposeArray(universe);
      const emptyColumns = getEmptyRows(transposedUniverse);
      console.log(emptyColumns);

      const part1ExpansionFactor = 2;
      const part2ExpansionFactor = 1_000_000;

      const galaxies = getGalaxies(universe);
      // const galaxyKeys = Object.keys(galaxies);
      // const combinations = galaxyKeys.flatMap((d) =>
      //   galaxyKeys.map(
      //     (v) =>
      //       Math.min(Number(d), Number(v)) +
      //       "," +
      //       Math.max(Number(d), Number(v)),
      //   ),
      // );

      const expandedGalaxies: number[][] = getExpandedGalaxies(
        galaxies,
        emptyRows,
        emptyColumns,
        part1ExpansionFactor,
      );

      const foo = getExpandedUniverse(data);
      const bar = getGalaxies(foo);
      console.log("original galaxies");
      console.log(bar);
      console.log("new galaxies");
      console.log(expandedGalaxies);

      // const combinationSet = new Set(combinations); // remove duplicates
      // let distanceSum = 0;
      // combinationSet.forEach((combination) => {
      //   const [galA, galB] = combination.split(",");
      //   if (galA == galB) {
      //     return;
      //   }

      //   const galAIndexes = galaxies[galA];
      //   const galBIndexes = galaxies[galB];

      //   const rowDistance = Math.abs(galAIndexes[0] - galBIndexes[0]);
      //   const columnDistance = Math.abs(galAIndexes[1] - galBIndexes[1]);

      //   const distance = rowDistance + columnDistance;
      //   distanceSum += distance;
      // });

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

  function getExpandedGalaxies(
    galaxies: number[][],
    emptyRows: number[],
    emptyColumns: number[],
    part1ExpansionFactor: number,
  ) {
    const expandedGalaxies: number[][] = [];
    galaxies.forEach((galaxy) => {
      const [rowIndex, columnIndex] = galaxy;

      const releventEmptyRows = emptyRows.filter((x) => x < rowIndex);
      const releventEmptyColumns = emptyColumns.filter((x) => x < columnIndex);

      const expandedRowIndex =
        rowIndex + releventEmptyRows.length * (part1ExpansionFactor - 1);
      const expandedColumnIndex =
        columnIndex + releventEmptyColumns.length * (part1ExpansionFactor - 1);

      const expandedIndex = [expandedRowIndex, expandedColumnIndex];
      expandedGalaxies.push(expandedIndex);
    });
    return expandedGalaxies;
  }

  function getGalaxies(expanded: string[][]): number[][] {
    const galaxies: number[][] = [];

    let galaxyCount = 0;
    for (let row = 0; row < expanded.length; row++) {
      const expandedRow = expanded[row];
      for (let column = 0; column < expandedRow.length; column++) {
        if (expandedRow[column] == "#") {
          galaxies[galaxyCount] = [row, column];
          galaxyCount++;
        }
      }
    }
    return galaxies;
  }

  function getExpandedUniverse(data: string[]) {
    const unexpanded: string[][] = [];
    data.forEach((row) => {
      const splitRow = row.split("");
      unexpanded.push(splitRow);
    });

    const expandedRow: string[][] = addEmptyRows(unexpanded);

    const transposedExpandedRow = transposeArray(expandedRow);
    const expandedColumns = addEmptyRows(transposedExpandedRow);

    const expanded = transposeArray(expandedColumns);
    return expanded;
  }

  function transposeArray(expandedRow: string[][]): string[][] {
    return expandedRow[0].map((_, colIndex) =>
      expandedRow.map((row) => row[colIndex]),
    );
  }

  function getEmptyRows(universe: string[][]): number[] {
    const emptyRows: number[] = [];
    for (let i = 0; i < universe.length; i++) {
      const row = universe[i];
      const emptySpaceRow = row.filter((x) => x === ".");
      if (emptySpaceRow.length == row.length) {
        emptyRows.push(i);
      }
    }
    return emptyRows;
  }

  function addEmptyRows(unexpanded: string[][]): string[][] {
    const expandedRow: string[][] = [];
    unexpanded.forEach((row) => {
      expandedRow.push(row);
      const emptySpaceRow = row.filter((x) => x === ".");
      if (emptySpaceRow.length === row.length) {
        // empty row, so we need it twice
        expandedRow.push(row);
      }
    });
    return expandedRow;
  }
}
