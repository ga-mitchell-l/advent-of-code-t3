import type { PartResults } from "~/classes/PuzzleResults";

export type ResultProps = {
  handleGetResults: () => void;
  handleExampleGetResults: () => void;
  part1: string | number;
  part2: string | number;
};

export type PuzzleProps = {
  handleGetResults: () => void;
  handleExampleGetResults: () => void;
  day: number;
  results: PartResults;
};

export type NavigationProps = {
  day: number;
};
