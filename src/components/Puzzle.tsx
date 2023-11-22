import React from "react"; // we need this to make JSX compile
import { PuzzleProps } from "../types/Props";
import Navigation from "./Navigation";
import Results from "./Results";

const Puzzle = ({ handleGetResults, day, results }: PuzzleProps) => {
  return (
    <div>
      <h1>Day {day}</h1>
      <Results
        handleGetResults={handleGetResults}
        part1={results.part1}
        part2={results.part2}
        type="puzzle"
      />
      <Navigation day={day} />
    </div>
  );
};

export default Puzzle;
