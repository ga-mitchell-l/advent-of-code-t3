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
      const expanded = getExpandedUniverse(data);
      const galaxies: number[][] = getGalaxies(expanded);

      console.log(galaxies);

      setParts({
        part1: 0,
        part2: 0,
      });
    }

    return (
      <Puzzle
        handleGetResults={() => processData(data)}
        handleExampleGetResults={() => processData(exampleData)}
        day={day}
        results={parts}
      ></Puzzle>
    );
    function getGalaxies(expanded: string[][]): number[][] {
      const galaxies: number[][] = [];

      for (let row = 0; row < expanded.length; row++) {
        const expandedRow = expanded[row];
        for (let column = 0; column < expandedRow.length; column++) {
          if (expandedRow[column] == "#") {
            galaxies.push([row, column]);
          }
        }
      }
      return galaxies;
    }
  };

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
