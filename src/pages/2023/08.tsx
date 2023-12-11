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
  const exampleData3 = [
    "LR",
    "",
    "11A = (11B, XXX)",
    "11B = (XXX, 11Z)",
    "11Z = (11B, XXX)",
    "22A = (22B, XXX)",
    "22B = (22C, 22C)",
    "22C = (22Z, 22Z)",
    "22Z = (22B, 22B)",
    "XXX = (XXX, XXX)",
  ];
  const startNode = "AAA";

  const processData = (data: string[] | undefined) => {
    if (data) {
      const instructions = data.shift().split("");
      console.log("instruction length: " + instructions.length);
      data.shift(); // empty row

      const nodeDict = getNodes(data);
      let instructionIndex = part1(instructions, nodeDict, startNode);

      const part2 = getPart2(nodeDict, instructions);

      setParts({
        part1: instructionIndex,
        part2: part2,
      });
    }
  };

  return (
    <Puzzle
      handleGetResults={() => processData(data)}
      handleExampleGetResults={() => processData(exampleData3)}
      day={day}
      results={parts}
    ></Puzzle>
  );

  function getPart2(
    nodeDict: { [key: string]: [string, string] },
    instructions: string[],
  ) {
    let startingNodes = Object.keys(nodeDict).filter(
      (node) => node[node.length - 1] === "A",
    );
    let zIndexes: number[] = [];
    startingNodes.forEach((node) => {
      const zIndex = part1(instructions, nodeDict, node);
      zIndexes.push(zIndex);
    });

    const instructionCycles = zIndexes.map((x) => x / instructions.length);

    const multiples = instructionCycles.reduce((a, b) => a * b, 1);
    const part2 = multiples * instructions.length;
    return part2;
  }

  function part1(
    instructions: string[],
    nodeDict: { [key: string]: [string, string] },
    startNode: string,
  ) {
    let currentNode = startNode;

    let instructionIndex = 0;
    while (currentNode[currentNode.length - 1] != "Z") {
      const instructionIndexMod = instructionIndex % instructions.length;
      let currentInstruction = instructions[instructionIndexMod];

      switch (currentInstruction) {
        case "L":
          currentNode = nodeDict[currentNode][0];
          break;
        case "R":
          currentNode = nodeDict[currentNode][1];
          break;
      }

      instructionIndex++;
    }
    return instructionIndex;
  }

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
