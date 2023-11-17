// React utilities
//
// Utilities for React implementations

/**
 * Retrieve a puzzle input as an array of lines.
 */

export const getInputFileName = (year: number, day: number): string => {
  return `./src/input/adventofcode.com_${year}_day_${day}_input.txt`;
};
