import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getInputFileName } from "../../../utils/react";
import fs from "fs";

export const fileRouter = createTRPCRouter({
  getInputFile: publicProcedure
    .input(
      z.object({
        year: z.number(),
        day: z.number(),
        example: z.boolean().default(false),
      }),
    )
    .query(async ({ input }) => {
      let fileName = getInputFileName(input.year, input.day, input.example);
      let data = fs.readFileSync(fileName, {
        encoding: "utf8",
        flag: "r",
      });
      let lines = data.split("\n");
      if (lines[lines.length - 1] === "") lines.splice(-1);
      return lines;
    }),
});
