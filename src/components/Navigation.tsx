import React from "react"; // we need this to make JSX compile
import type { NavigationProps } from "../types/Props";
import Link from "next/link";

const Navigation = ({ day }: NavigationProps) => {
  const previousClassName = day < 2 ? "invisible" : "";
  const nextClassName = day > 25 ? "invisible" : "";
  const previousPageName = (day - 1).toString().padStart(2, "0");
  const nextPageName = (day + 1).toString().padStart(2, "0");

  return (
    <div className="space-x-2">
      <Link
        href={previousPageName}
        className={
          previousClassName +
          " rounded border border-blue-500 bg-transparent px-1 py-1 font-bold font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
        }
      >
        Previous
      </Link>
      <Link
        href={nextPageName}
        className={
          nextClassName +
          " rounded border border-blue-500 bg-transparent px-1 py-1 font-bold font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
        }
      >
        Next
      </Link>
    </div>
  );
};

export default Navigation;
