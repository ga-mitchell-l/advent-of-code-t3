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
  const data = api.file.getInputFile.useQuery({ year: 2022, day: day }).data;
  const exampleData: string[] = ["30373", "25512", "65332", "33549", "35390"];

  class Tree {
    height: number;
    visible: boolean;
    scenicScore: number;
  }

  const processData = (data: string[] | undefined) => {
    if (data) {
      const gridSize: number = data.length;

      const treeGrid = new Array<Array<Tree>>(gridSize);
      for (let i = 0; i < gridSize; i++) {
        const treeRowRaw: number[] = data[i].split("").map(Number);
        treeGrid[i] = new Array<Tree>();

        for (let j = 0; j < gridSize; j++) {
          const newTree = new Tree();
          newTree.height = treeRowRaw[j];

          let visibleUp: boolean;
          let visibleDown: boolean;
          let visibleLeft: boolean;
          let visibleRight: boolean;

          let scenicUp: number;
          let scenicDown: number;
          let scenicLeft: number;
          let scenicRight: number;

          // vertical
          const column = data.map(function (value, _) {
            return Number(value[j]);
          });

          if (i == 0) {
            visibleUp = true;
            scenicUp = 0;
          } else {
            const treesUp = column.slice(0, i);
            const maxTreesUp = Math.max(...treesUp);
            visibleUp = maxTreesUp < newTree.height;

            // part 2
            const logicUp = treesUp
              .map((h) => {
                return h < newTree.height;
              })
              .reverse();
            const indexSight = logicUp.indexOf(false);
            scenicUp = indexSight == -1 ? treesUp.length : indexSight + 1;
          }

          if (i == gridSize - 1) {
            visibleDown = true;
            scenicDown = 0;
          } else {
            const treesDown = column.slice(i + 1, gridSize);
            const maxTreesDown = Math.max(...treesDown);
            visibleDown = maxTreesDown < newTree.height;

            // part 2
            const logicDown = treesDown.map((h) => {
              return h < newTree.height;
            });

            const indexSight = logicDown.indexOf(false);
            scenicDown = indexSight == -1 ? treesDown.length : indexSight + 1;
          }
          // horizonal

          if (j == 0) {
            visibleLeft = true;
            scenicLeft = 0;
          } else {
            const treesLeft = treeRowRaw.slice(0, j);
            const maxTreesLeft = Math.max(...treesLeft);
            visibleLeft = maxTreesLeft < newTree.height;

            // part 2
            const logicLeft = treesLeft
              .map((h) => {
                return h < newTree.height;
              })
              .reverse();
            const indexSight = logicLeft.indexOf(false);
            scenicLeft = indexSight == -1 ? treesLeft.length : indexSight + 1;
          }

          if (j == gridSize - 1) {
            visibleRight = true;
            scenicRight = 0;
          } else {
            const treesRight = treeRowRaw.slice(j + 1, gridSize);
            const maxTreesRight = Math.max(...treesRight);
            visibleRight = maxTreesRight < newTree.height;

            // part 2
            const logicRight = treesRight.map((otherHeight) => {
              return otherHeight < newTree.height;
            });
            const indexSight = logicRight.indexOf(false);
            scenicRight = indexSight == -1 ? treesRight.length : indexSight + 1;
          }

          newTree.visible =
            visibleLeft || visibleRight || visibleUp || visibleDown;

          newTree.scenicScore =
            scenicLeft * scenicRight * scenicUp * scenicDown;

          treeGrid[i].push(newTree);
        }
      }

      const numVisibleTrees = treeGrid.reduce(
        (sum, treeRow) => sum + treeRow.filter((t) => t.visible).length,
        0,
      );

      const maxScenic = treeGrid.reduce(
        (max, treeRow) =>
          Math.max(max, Math.max(...treeRow.map((x) => x.scenicScore))),
        0,
      );

      setParts({
        part1: numVisibleTrees,
        part2: maxScenic,
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
}
