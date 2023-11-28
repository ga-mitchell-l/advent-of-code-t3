import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day06() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 6;
  const data = api.file.getInputFile.useQuery({ year: 2022, day: day }).data;
  const exampleData: string[] = ["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"];

  const processData = (data: string[] | undefined) => {
    if (data) {
      setParts({
        part1: GetMessageStartIndex(data, 4),
        part2: GetMessageStartIndex(data, 14),
      });
    }
  };

  return (
    <Puzzle
      handleGetResults={() => processData(data)}
      handleExampleGetResults={() => processData(exampleData)}
      day={day}
      results={parts}
    ></Puzzle>
  );

  function GetMessageStartIndex(data: string[], packetMarkerSize: number) {
    let messageStartIndex = 0;
    const row = data[0]; // only a single row for this puzzle
    if (row) {
      const splitRow = row.split("");
      let packetIndex = 0;
      outerLoop: for (let i = 0; i < splitRow.length - packetMarkerSize; i++) {
        const check = splitRow.slice(i, i + packetMarkerSize);
        const noDuplicatesCheck = new Set(check);

        if (check.length == noDuplicatesCheck.size) {
          packetIndex = i;
          break outerLoop;
        }
      }
      messageStartIndex = packetIndex + packetMarkerSize;
    }
    return messageStartIndex;
  }
}
