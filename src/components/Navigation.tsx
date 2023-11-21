import React from "react"; // we need this to make JSX compile
import { NavigationProps } from "../types/Props";
import Link from "next/link";

const Navigation = ({ day }: NavigationProps) => {
  const previousClassName = day < 2 ? "invisible" : "";
  const nextClassName = day > 25 ? "invisible" : "";
  const previousPageName = (day - 1).toString().padStart(2, "0");
  const nextPageName = (day + 1).toString().padStart(2, "0");

  return (
    <div>
      <Link href={previousPageName} className={previousClassName}>
        Previous
      </Link>
      <Link href={nextPageName} className={nextClassName}>
        Next
      </Link>
    </div>
  );
};

export default Navigation;
