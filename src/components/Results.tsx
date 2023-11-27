import React from "react"; // we need this to make JSX compile
import { ResultProps } from "../types/Props";

const Results = ({
  handleGetResults,
  handleExampleGetResults,
  part1,
  part2,
}: ResultProps) => {
  return (
    <>
      <div className="space-x-2">
        <button
          onClick={handleExampleGetResults}
          className="rounded bg-blue-500 px-1 py-1 font-bold text-white hover:bg-blue-700"
        >
          Get Example Results
        </button>
        <button
          onClick={handleGetResults}
          className="rounded bg-blue-500 px-1 py-1 font-bold text-white hover:bg-blue-700"
        >
          Get Puzzle Results
        </button>
      </div>
      <div>
        <div>Part 1: {part1}</div>
        <div>Part 2: {part2}</div>
      </div>
    </>
  );
};

export default Results;
