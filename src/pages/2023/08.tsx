import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day08() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 8;
  const year = 2023;
  const data: string[] = api.file.getInputFile.useQuery({
    year: year,
    day: day,
  }).data;
  const exampleData: string[] = [
    "RL",
    "",
    "AAA = (BBB, CCC)",
    "BBB = (DDD, EEE)",
    "CCC = (ZZZ, GGG)",
    "DDD = (DDD, DDD)",
    "EEE = (EEE, EEE)",
    "GGG = (GGG, GGG)",
    "ZZZ = (ZZZ, ZZZ)",
  ];
  const exampleData2: string[] = [
    "LLR",
    "",
    "AAA = (BBB, BBB)",
    "BBB = (AAA, ZZZ)",
    "ZZZ = (ZZZ, ZZZ)",
  ];
  const startNode = "AAA";
  const finishNode = "ZZZ";

  const processData = (data: string[] | undefined) => {
    if (data) {
      const instructions = data.shift().split("");
      data.shift(); // empty row

      const nodeDict = getNodes(data);
      let currentNode = startNode;

      let steps = 0;
      let instructionIndex = 0;
      while (currentNode != finishNode) {}

      setParts({
        part1: 0,
        part2: 0,
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

  function getNodes(data: string[]) {
    const nodeDict: { [key: string]: [string, string] } = {};

    data.forEach((row) => {
      const [node, right] = row.split(" = ");
      const moves = right.slice(1, right.length - 1).split(", ");
      nodeDict[node] = [moves[0], moves[1]];
    });
    return nodeDict;
  }
}
