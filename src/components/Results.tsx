import React from "react"; // we need this to make JSX compile
import { ResultProps } from "../types/Props";
import Link from "next/link";

const Results = ({ handleGetResults, part1, part2, day }: ResultProps) => {
  const previousClassName = day < 2 ? "invisible" : "";
  const nextClassName = day > 25 ? "invisible" : "";
  const previousPageName = (day - 1).toString().padStart(2, "0");
  const nextPageName = (day + 1).toString().padStart(2, "0");

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
      <div>
        <Link href={previousPageName} className={previousClassName}>
          Previous
        </Link>
        <Link href={nextPageName} className={nextClassName}>
          Next
        </Link>
      </div>
    </div>
  );
};

export default Results;
