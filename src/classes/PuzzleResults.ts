export class PuzzleResults {
  inputResults: PartResults;
  exampleResults: PartResults;

  constructor() {
    this.inputResults = {
      part1: 0,
      part2: 0,
    };
    this.exampleResults = {
      part1: 0,
      part2: 0,
    };
  }
}

type PartResults = {
  part1: number;
  part2: number;
};
