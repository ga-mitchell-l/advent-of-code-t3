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
    .query(({ input }) => {
      const fileName = getInputFileName(input.year, input.day, input.example);
      const data = fs.readFileSync(fileName, {
        encoding: "utf8",
        flag: "r",
      });
      const lines = data.split("\n");
      if (lines[lines.length - 1] === "") lines.splice(-1);
      return lines;
    }),
});
