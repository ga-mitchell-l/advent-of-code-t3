import React from "react"; // we need this to make JSX compile
import { ResultProps } from "../types/Props";

const Results = ({ handleGetResults, part1, part2 }: ResultProps) => {
  return (
    <div>
      <button
        onClick={handleGetResults}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Get Results
      </button>
      <div>Part 1: {part1}</div>
      <div>Part 2: {part2}</div>
    </div>
  );
};

export default Results;
