import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import { PartResults } from "~/classes/PuzzleResults";

export default function Day08() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 8;
  const data = api.file.getInputFile.useQuery({ year: 2022, day: day }).data;
  const exampleData: string[] = ["30373", "25512", "65332", "33549", "35390"];

  class Tree {
    height: number;
    visibleLeft: boolean;
    visibleRight: boolean;
    visibleUp: boolean;
    visibleDown: boolean;
    visible: boolean;
  }

  const processData = (data: string[] | undefined) => {
    if (data) {
      let part2Count: number = 0;
      let gridSize: number = data.length;

      let treeGrid = new Array<Array<Tree>>(gridSize);
      for (let i = 0; i < gridSize; i++) {
        let treeRowRaw: number[] = data[i].split("").map(Number);
        treeGrid[i] = new Array<Tree>();

        for (let j = 0; j < gridSize; j++) {
          let newTree = new Tree();
          let height = treeRowRaw[j];
          newTree.height = height;

          // vertical
          let column = data.map(function (value, index) {
            return Number(value[j]);
          });
          console.log(column);

          if (i == 0) {
            newTree.visibleUp = true;
          } else {
            let maxTreesUp = Math.max(...column.slice(0, i));
            newTree.visibleUp = maxTreesUp < height;
          }

          if (i == gridSize - 1) {
            newTree.visibleDown = true;
          } else {
            let maxTreesDown = Math.max(...column.slice(i + 1, gridSize));
            newTree.visibleDown = maxTreesDown < height;
          }
          // horizonal

          if (j == 0) {
            newTree.visibleLeft = true;
          } else {
            let maxTreesLeft = Math.max(...treeRowRaw.slice(0, j));
            newTree.visibleLeft = maxTreesLeft < height;
          }

          if (j == gridSize - 1) {
            newTree.visibleRight = true;
          } else {
            let maxTreesRight = Math.max(...treeRowRaw.slice(j + 1, gridSize));
            newTree.visibleRight = maxTreesRight < height;
          }

          newTree.visible =
            newTree.visibleLeft ||
            newTree.visibleRight ||
            newTree.visibleUp ||
            newTree.visibleDown;

          treeGrid[i].push(newTree);
        }
      }

      console.log(treeGrid);
      let numVisibleTrees = treeGrid.reduce(
        (sum, treeRow) => sum + treeRow.filter((t) => t.visible).length,
        0,
      );

      setParts({
        part1: numVisibleTrees,
        part2: part2Count,
      });
    }
  };

  return (
    <Puzzle
      handleGetResults={() => {
        processData(data);
      }}
      day={day}
      results={parts}
    ></Puzzle>
  );
}
