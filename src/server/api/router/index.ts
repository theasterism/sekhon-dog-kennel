import { os } from "@orpc/server";
import * as z from "zod";

export const appRouter = {
  hello: os
    .input(
      z.object({
        text: z.string().nullish(),
      }),
    )
    .handler(({ input }) => {
      return {
        greeting: `Hello from oRPC, ${input.text ?? "Anonymous"}`,
      };
    }),
};
