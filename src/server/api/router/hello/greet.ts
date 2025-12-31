import { publicProcedure } from "@/server/api/trpc";

export const greet = publicProcedure.query(() => {
  return { message: "Hello from tRPC!" };
});
