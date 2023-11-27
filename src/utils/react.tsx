// React utilities
//
// Utilities for React implementations

import { SetStateAction } from "react";
import { PuzzleResults } from "~/classes/PuzzleResults";

/**
 * Retrieve a puzzle input as an array of lines.
 */

export const getInputFileName = (
  year: number,
  day: number,
  example: boolean = false,
): string => {
  return `./src/input/adventofcode.com_${year}_day_${day}_input${
    example ? "_example" : ""
  }.txt`;
};

export const UpdateResults = (
  exampleData: boolean,
  part1: number,
  part2: number,
  results: PuzzleResults,
) => {
  let updatedResults = results;
  if (exampleData) {
    updatedResults.exampleResults.part1 = part1;
    updatedResults.exampleResults.part2 = part2;
  } else {
    updatedResults.inputResults.part1 = part1;
    updatedResults.inputResults.part2 = part2;
  }
  return updatedResults;
};
