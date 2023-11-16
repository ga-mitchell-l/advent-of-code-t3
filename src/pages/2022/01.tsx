import { getInputFileName } from "../../utils/react";
export default function puzzle() {
  const fileName = getInputFileName(2022, 1);
  return <div>{fileName}</div>;
}
