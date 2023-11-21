import React from "react"; // we need this to make JSX compile
import { PuzzleProps, ResultProps } from "../types/Props";
import Link from "next/link";
import Navigation from "./Navigation";
import Results from "./Results";

const Puzzle = ({ handleGetResults, part1, part2, day }: PuzzleProps) => {
  return (
    <div>
      <Results
        handleGetResults={handleGetResults}
        part1={part1}
        part2={part2}
        type="puzzle"
      />
      <Navigation day={day} />
    </div>
  );
};

export default Puzzle;
