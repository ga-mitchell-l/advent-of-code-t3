import React from "react"; // we need this to make JSX compile
import { Puzzle2Props } from "../types/Props";
import Navigation from "./Navigation";
import Results from "./Results";

const Puzzle2 = ({ handleGetResults, day, results }: Puzzle2Props) => {
  return (
    <div>
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

export default Puzzle2;
