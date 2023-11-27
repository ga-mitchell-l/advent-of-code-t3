import React from "react"; // we need this to make JSX compile
import { NavigationProps } from "../types/Props";
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
          " rounded bg-blue-500 px-1 py-1 font-bold text-white hover:bg-blue-700"
        }
      >
        Previous
      </Link>
      <Link
        href={nextPageName}
        className={
          nextClassName +
          " rounded bg-blue-500 px-1 py-1 font-bold text-white hover:bg-blue-700"
        }
      >
        Next
      </Link>
    </div>
  );
};

export default Navigation;
