// React utilities
//
// Utilities for React implementations

import { number } from "zod";

/**
 * Retrieve a puzzle input as an array of lines.
 */
export const getPuzzleInput = (year: number, day: number) => {
  // ): Promise<string[]> => {
  const fileName = getInputFileName(year, day);
  console.log(fileName);
  // const data = await fetch(fileName).then((result) => result.text());
  // let lines = data.split("\n");
  // if (lines[lines.length - 1] === "") lines.splice(-1);
  // return [];
};

export const getInputFileName = (year: number, day: number): string => {
  const fileName = `../src/input/adventofcode.com_${year}_day_${day}_input.txt`;
  console.log(fileName);
  return fileName;
};
