import { PartResults } from "~/classes/PuzzleResults";

export type ResultProps = {
  handleGetResults: () => void;
  part1: number;
  part2: number;
  type: string;
};

export type PuzzleProps = {
  handleGetResults: () => void;
  day: number;
  results: PartResults;
};

export type NavigationProps = {
  day: number;
};
