import React from "react"; // we need this to make JSX compile
import { PuzzleProps } from "../types/Props";
import Navigation from "./Navigation";
import Results from "./Results";

const Puzzle = ({
  handleGetResults,
  handleExampleGetResults,
  day,
  results,
}: PuzzleProps) => {
  return (
    <div>
      <h1>Day {day}</h1>
      <Results
        handleGetResults={handleGetResults}
        handleExampleGetResults={handleExampleGetResults}
        part1={results.part1}
        part2={results.part2}
      />
      <Navigation day={day} />
    </div>
  );
};

export default Puzzle;
