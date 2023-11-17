import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getInputFileName } from "../../../utils/react";
import fs from "fs";
import { Input } from "postcss";

export const fileRouter = createTRPCRouter({
  getInputFile: publicProcedure
    .input(z.object({ year: z.number(), day: z.number() }))
    .query(async ({ input }) => {
      let fileName = getInputFileName(input.year, input.day);
      let inputFile = fs.readFileSync(fileName, {
        encoding: "utf8",
        flag: "r",
      });
      console.log(inputFile);
      return inputFile.split("\n");
    }),
});
