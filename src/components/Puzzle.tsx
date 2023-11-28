import React from "react"; // we need this to make JSX compile
import type { PuzzleProps } from "../types/Props";
import Navigation from "./Navigation";
import Results from "./Results";

const Puzzle = ({
  handleGetResults,
  handleExampleGetResults,
  day,
  results,
}: PuzzleProps) => {
  return (
    <div className="overflow-hidden bg-white py-5 font-mono sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h1 className="text-base font-semibold leading-7 text-indigo-600">
                Day {day}
              </h1>
              <Results
                handleGetResults={handleGetResults}
                handleExampleGetResults={handleExampleGetResults}
                part1={results.part1}
                part2={results.part2}
              />
              <Navigation day={day} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Puzzle;
