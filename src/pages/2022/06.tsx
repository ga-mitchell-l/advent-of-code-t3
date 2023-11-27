import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import { PartResults } from "~/classes/PuzzleResults";

export default function Day06() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 6;
  const data = api.file.getInputFile.useQuery({ year: 2022, day: day }).data;
  const exampleData: string[] = ["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"];
  const packetMarkerSize = 4;

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part1messageStartIndex = GetMessageStartIndex(data, 4);
      let part2MessageStartIndex = GetMessageStartIndex(data, 14);
      setParts({
        part1: part1messageStartIndex,
        part2: part2MessageStartIndex,
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
    let row = data[0]; // only a single row for this puzzle
    if (row) {
      let splitRow = row.split("");
      let packetIndex = 0;
      outerLoop: for (let i = 0; i < splitRow.length - packetMarkerSize; i++) {
        let check = splitRow.slice(i, i + packetMarkerSize);
        let noDuplicatesCheck = new Set(check);

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
