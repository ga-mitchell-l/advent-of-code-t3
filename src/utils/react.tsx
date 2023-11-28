// React utilities
//
// Utilities for React implementations

export const getInputFileName = (
  /**
   * Retrieve a puzzle input as an array of lines.
   */
  year: number,
  day: number,
  example = false,
): string => {
  return `./src/input/adventofcode.com_${year}_day_${day}_input${
    example ? "_example" : ""
  }.txt`;
};

export const SortDescending = (input: number[]): number[] => {
  input
    .sort(function (a, b) {
      return a - b;
    })
    .reverse();
  return input;
};
