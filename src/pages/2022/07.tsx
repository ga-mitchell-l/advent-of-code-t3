import { api } from "~/utils/api";
import { useState } from "react";
import Puzzle from "~/components/Puzzle";
import type { PartResults } from "~/classes/PuzzleResults";

export default function Day07() {
  const [parts, setParts] = useState<PartResults>({
    part1: 0,
    part2: 0,
  });

  const day = 7;
  const data = api.file.getInputFile.useQuery({ year: 2022, day: day }).data;
  const exampleData: string[] = [
    "$ cd /",
    "$ ls",
    "dir a",
    "14848514 b.txt",
    "8504156 c.dat",
    "dir d",
    "$ cd a",
    "$ ls",
    "dir e",
    "29116 f",
    "2557 g",
    "62596 h.lst",
    "$ cd e",
    "$ ls",
    "584 i",
    "$ cd ..",
    "$ cd ..",
    "$ cd d",
    "$ ls",
    "4060174 j",
    "8033020 d.log",
    "5626152 d.ext",
    "7214296 k];",
  ];

  interface ElfItem {
    type: "file" | "dir";
    name: string;
    size?: number;
    parent: ElfItem | null;
    children: ElfItem[] | null;
  }

  const processData = (data: string[] | undefined) => {
    if (data) {
      const fileSystem: ElfItem[] = [];

      data.splice(0, 1);
      fileSystem.push({ type: "dir", name: "/", children: [], parent: null });
      const root = fileSystem[0];

      const buildFileSystem = (dir: ElfItem, inputLineNumber: number) => {
        if (!data[inputLineNumber]) return;

        const [first, second, third] = data[inputLineNumber].split(" ");

        if (!isNaN(parseInt(first, 10))) {
          // file
          dir.children.push({
            type: "file",
            size: parseInt(first, 10),
            name: second,
            children: null,
            parent: dir,
          });
          buildFileSystem(dir, inputLineNumber + 1);
        } else if (first === "dir") {
          // directory
          dir.children.push({
            type: "dir",
            name: second,
            children: [],
            parent: dir,
          });
          buildFileSystem(dir, inputLineNumber + 1);
        } else if (first === "$" && second === "cd" && third !== "..") {
          const newDir = dir.children.find((child) => child.name === third);
          buildFileSystem(newDir, inputLineNumber + 1);
        } else if (first === "$" && second === "cd" && third === "..") {
          const newDir = dir.parent;
          buildFileSystem(newDir, inputLineNumber + 1);
        } else {
          buildFileSystem(dir, inputLineNumber + 1);
        }
      };

      buildFileSystem(root, 0);

      const getDirectorySize = (dir: ElfItem): number => {
        let size = 0;
        if (dir.type === "file") {
          return dir.size;
        } else {
          for (const child of dir.children) {
            size += getDirectorySize(child);
          }
        }
        return size;
      };

      const getDirectoriesWithSizeLessThan = (size: number): ElfItem[] => {
        const dirs: ElfItem[] = [];
        const traverse = (dir: ElfItem) => {
          if (dir.type === "dir") {
            const dirSize = getDirectorySize(dir);
            if (dirSize < size) {
              dir.size = dirSize;
              dirs.push(dir);
            }
            for (const child of dir.children) {
              traverse(child);
            }
          }
        };

        traverse(root);
        return dirs;
      };

      const dirsLessThan1000 = getDirectoriesWithSizeLessThan(100000);
      const sumSize = dirsLessThan1000.reduce((acc, dir) => acc + dir.size, 0);

      // part 2
      const diskSpace = 70000000;
      const updateSpaceNeeded = 30000000;

      const unusedSpace = diskSpace - getDirectorySize(root);
      const delta = updateSpaceNeeded - unusedSpace;

      const getDirectoriesWithSizeBiggerThan = (size: number): ElfItem[] => {
        const dirs: ElfItem[] = [];
        const traverse = (dir: ElfItem) => {
          if (dir.type === "dir") {
            const dirSize = getDirectorySize(dir);
            if (dirSize > size) {
              dir.size = dirSize;
              dirs.push(dir);
            }
            for (const child of dir.children) {
              traverse(child);
            }
          }
        };

        traverse(root);
        return dirs;
      };

      const deletionCandidates = getDirectoriesWithSizeBiggerThan(delta);
      const minDirectory = deletionCandidates.reduce((prev, curr) =>
        prev.size < curr.size ? prev : curr,
      );

      setParts({
        part1: sumSize,
        part2: minDirectory.size,
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
