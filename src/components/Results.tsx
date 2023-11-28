import React from "react"; // we need this to make JSX compile
import { ResultProps } from "../types/Props";

const Results = ({
  handleGetResults,
  handleExampleGetResults,
  part1,
  part2,
}: ResultProps) => {
  return (
    <div>
      <div className="space-x-2">
        <button
          onClick={handleExampleGetResults}
          className="rounded bg-blue-500 px-1 py-1 font-bold text-white hover:bg-blue-700"
        >
          Example Results
        </button>
        <button
          onClick={handleGetResults}
          className="rounded bg-blue-500 px-1 py-1 font-bold text-white hover:bg-blue-700"
        >
          Puzzle Results
        </button>
      </div>
      <div className="my-2">
        <div className="display: flex">
          <p className="font-bold">Part 1: </p>
          <p>{part1}</p>
        </div>
        <div className="display: flex">
          <p className="font-bold">Part 2: </p>
          <p>{part2}</p>
        </div>
      </div>
    </div>
  );
};

export default Results;
