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
    visible: boolean;
    scenicScore: number;
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
          let visibleUp: boolean;
          let visibleDown: boolean;
          let visibleLeft: boolean;
          let visibleRight: boolean;

          let scenicUp: number;
          let scenicDown: number;
          let scenicLeft: number;
          let scenicRight: number;

          // vertical
          let column = data.map(function (value, index) {
            return Number(value[j]);
          });

          if (i == 0) {
            visibleUp = true;
            scenicUp = 0;
          } else {
            let treesUp = column.slice(0, i);
            let maxTreesUp = Math.max(...treesUp);
            visibleUp = maxTreesUp < height;

            // part 2
            let logicUp = treesUp
              .map((h) => {
                return h < height;
              })
              .reverse();
            let indexSight = logicUp.indexOf(false);
            scenicUp = indexSight == -1 ? treesUp.length : indexSight + 1;
          }

          if (i == gridSize - 1) {
            visibleDown = true;
            scenicDown = 0;
          } else {
            let treesDown = column.slice(i + 1, gridSize);
            let maxTreesDown = Math.max(...treesDown);
            visibleDown = maxTreesDown < height;

            // part 2
            let logicDown = treesDown.map((h) => {
              return h < height;
            });

            let indexSight = logicDown.indexOf(false);
            scenicDown = indexSight == -1 ? treesDown.length : indexSight + 1;
          }
          // horizonal

          if (j == 0) {
            visibleLeft = true;
            scenicLeft = 0;
          } else {
            let treesLeft = treeRowRaw.slice(0, j);
            let maxTreesLeft = Math.max(...treesLeft);
            visibleLeft = maxTreesLeft < height;

            // part 2
            let logicLeft = treesLeft
              .map((h) => {
                return h < height;
              })
              .reverse();
            let indexSight = logicLeft.indexOf(false);
            scenicLeft = indexSight == -1 ? treesLeft.length : indexSight + 1;
          }

          if (j == gridSize - 1) {
            visibleRight = true;
            scenicRight = 0;
          } else {
            let treesRight = treeRowRaw.slice(j + 1, gridSize);
            let maxTreesRight = Math.max(...treesRight);
            visibleRight = maxTreesRight < height;

            // part 2
            let logicRight = treesRight.map((otherHeight) => {
              return otherHeight < height;
            });
            let indexSight = logicRight.indexOf(false);
            scenicRight = indexSight == -1 ? treesRight.length : indexSight + 1;
          }

          newTree.visible =
            visibleLeft || visibleRight || visibleUp || visibleDown;

          newTree.scenicScore =
            scenicLeft * scenicRight * scenicUp * scenicDown;

          treeGrid[i].push(newTree);
        }
      }

      console.log(treeGrid);
      let numVisibleTrees = treeGrid.reduce(
        (sum, treeRow) => sum + treeRow.filter((t) => t.visible).length,
        0,
      );

      let maxScenic = treeGrid.reduce(
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
      handleGetResults={() => {
        processData(data);
      }}
      day={day}
      results={parts}
    ></Puzzle>
  );
}
